import * as t from 'io-ts';

export const History = t.type({
  id: t.string,
  type: t.literal('history'),
  attributes: t.type({
    date: t.string,
    title: t.string,
    amount: t.number,
    institution: t.string,
    isTransfer: t.boolean,
  }),
  relationships: t.type({
    tags: t.type({
      data: t.array(t.type({
        type: t.literal('tag'),
        id: t.string,
      })),
    }),
  }),
});

export type History = t.TypeOf<typeof History>;

export function decodeHistory(object: unknown) {
  const either = History.decode(object);
  if (either._tag === 'Left') {
    console.error(`History: Invalid format`);
    throw either.left;
  }
  return either.right;
}
