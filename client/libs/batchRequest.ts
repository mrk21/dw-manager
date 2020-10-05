import { debounce, uniq } from 'lodash';

type BatchedResponse<Response> = { [key: string]: Response; };

type RequestFn<Params, Response, Vars extends any[]> =
  (...vars: [...Vars]) =>
    (paramsList: Params[]) =>
      Promise<BatchedResponse<Response>>;

type KeyFn<Params> = (params: Params) => string;

type Config = {
  wait: number; // [msec]
  max: number;
};

type Queue<Params, Response> = Array<{
  params: Params;
  resolve: (result: Response) => void;
}>;

export function batchRequest<Params, Response, Vars extends any[]>(request: RequestFn<Params, Response, Vars>, key: KeyFn<Params>) {
  return ({ wait, max }: Config) => {
    const _queue: Queue<Params, Response> = [];
    let _vars: [...Vars];

    const requestDebounced = debounce(async () => {
      const queued = _queue.splice(0);
      if (queued.length === 0) return;

      const paramsList = uniq(queued.map(({ params }) => params));
      const results = await request(..._vars)(paramsList);

      queued.forEach(({ params, resolve }) => {
        const result = results[key(params)];
        resolve(result);
      });
    }, wait);

    return (...vars: [...Vars]) => {
      _vars = vars;

      return async (params: Params) => {
        return new Promise<Response>((resolve) => {
          requestDebounced();
          _queue.push({ params, resolve });
          if (_queue.length >= max) {
            requestDebounced.flush();
          }
        });
      }
    };
  };
}
