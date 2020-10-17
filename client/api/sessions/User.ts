import * as t from 'io-ts';

export const User = t.type({
  id: t.string,
  type: t.literal('user'),
  attributes: t.type({
    screenName: t.string,
    name: t.string,
  }),
});

export type User = t.TypeOf<typeof User>;
