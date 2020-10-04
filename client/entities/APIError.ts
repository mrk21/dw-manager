import * as t from 'io-ts';

export const APIError = t.type({
  status: t.string,
  code: t.string,
  title: t.string,
  detail: t.union([ t.object, t.undefined ]),
  meta: t.union([ t.object, t.undefined ]),
});

export type APIError = t.TypeOf<typeof APIError>;
