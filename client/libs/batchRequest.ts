import { debounce, uniq } from '@/libs';

type BatchedResponse<Response> = {
  [key: string]: Response;
};

type RequestFn<Params, Response, Vars extends any[]> =
  (...vars: [...Vars]) =>
    (paramsList: Params[]) =>
      Promise<BatchedResponse<Response> | undefined>;

type KeyFn<Params> = (params: Params) => string;

type Config = {
  wait: number; // [msec]
  max: number;
};

type Queue<Params, Response> = Array<{
  params: Params;
  resolve: (response: Response) => void;
  reject: (error: Error) => void;
}>;

export function batchRequest<Params, Response, Vars extends any[]>(
  request: RequestFn<Params, Response, Vars>,
  key: KeyFn<Params>
) {
  return ({ wait, max }: Config) => {
    const queue: Queue<Params, Response> = [];

    const requestDebounced = debounce(async (vars: [...Vars]) => {
      const queued = queue.splice(0);
      if (queued.length === 0) return;

      const paramsList = uniq(queued.map(({ params }) => params));
      const responseList = await request(...vars)(paramsList);

      if (responseList) {
        queued.forEach(({ params, resolve }) => {
          const response = responseList[key(params)];
          resolve(response);
        });
      }
      else {
        const error = new Error("batch request error");
        queued.forEach(({ reject }) => {
          reject(error);
        });
      }
    }, wait);

    return (...vars: [...Vars]) => {
      return async (params: Params) => {
        return new Promise<Response>((resolve, reject) => {
          if (queue.length === 0) requestDebounced(vars);
          queue.push({ params, resolve, reject });
          if (queue.length >= max) {
            requestDebounced.flush();
          }
        });
      }
    };
  };
}
