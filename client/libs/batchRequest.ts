import { debounce, uniq } from '@/libs';

type ParamBase = {
  toString(): string
};

type BatchedResponse<Response> = {
  [key: string]: Response;
};

type RequestFn<Params extends ParamBase, Response, Vars extends any[]> =
  (paramsList: Params[], ...vars: [...Vars]) =>
    Promise<BatchedResponse<Response> | undefined>;

type KeyFn<Params extends ParamBase> = (params: Params) => string;

type Config<Params extends ParamBase> = {
  key?: KeyFn<Params>;
  wait?: number; // [msec]
  max?: number;
};

type Queue<Params extends ParamBase, Response> = Array<{
  params: Params;
  resolve: (response: Response) => void;
  reject: (error: Error) => void;
}>;

export function batchRequest<Params extends ParamBase, Response, Vars extends any[]>(
  request: RequestFn<Params, Response, Vars>,
  {
    key = (param) => param.toString(),
    wait = 20,
    max = 100,
  }: Config<Params> = {}
) {
  const queue: Queue<Params, Response> = [];

  const requestDebounced = debounce(async (vars: [...Vars]) => {
    const queued = queue.splice(0);
    if (queued.length === 0) return;

    const paramsList = uniq(queued.map(({ params }) => params));
    const responseList = await request(paramsList, ...vars);

    if (responseList) {
      queued.forEach(({ params, resolve }) => {
        const response = responseList[key(params)];
        resolve(response);
      });
    }
    else {
      const error = new Error("batch request error");
      queued.forEach(({ reject }) => reject(error));
    }
  }, wait);

  return async (params: Params, ...vars: [...Vars]) => new Promise<Response>((resolve, reject) => {
    if (queue.length === 0) requestDebounced(vars);
    queue.push({ params, resolve, reject });
    if (queue.length >= max) requestDebounced.flush();
  });
}
