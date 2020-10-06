import * as t from 'io-ts';

export const JsonAPIError = t.type({
  code: t.string,
  title: t.string,
  detail: t.union([ t.object, t.undefined ]),
  meta: t.union([ t.object, t.undefined ]),
});

export type JsonAPIError = t.TypeOf<typeof JsonAPIError>;
