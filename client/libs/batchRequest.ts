import { debounce, uniq } from 'lodash';

type RequestFn<Params, Result, Args extends any[]> =
  (...args: [...Args]) =>
    (paramsList: Params[]) =>
      Promise<{ [key: string]: Result; }>;

type KeyFn<Params> = (params: Params) => string;

type Config = {
  interval: number;
  max: number;
};

type Queue<Params, Result> = Array<{
  params: Params;
  resolve: (result: Result) => void;
}>;

export function batchRequest<Params, Result, Args extends any[]>(request: RequestFn<Params, Result, Args>, key: KeyFn<Params>) {
  return ({ interval, max }: Config) => {
    const queue: Queue<Params, Result> = [];
    let args: [...Args];

    const requestDebounced = debounce(async () => {
      const que = queue.splice(0);
      if (que.length === 0) return;

      const paramsList = que.map(({ params }) => params);
      console.debug('### batch request: request:', paramsList);
      const results = await request(...args)(uniq(paramsList));

      que.forEach(({ params, resolve }) => {
        const result = results[key(params)];
        console.debug('### batch request: resolve:', params, result);
        resolve(result);
      });
    }, interval);

    return (...args_: [...Args]) => {
      args = args_;

      return async (params: Params) => {
        requestDebounced();

        return new Promise<Result>((resolve) => {
          console.debug('### batch request: push:', params);
          queue.push({ params, resolve });
          if (queue.length >= max) {
            requestDebounced.flush();
          }
        });
      }
    };
  };
}
