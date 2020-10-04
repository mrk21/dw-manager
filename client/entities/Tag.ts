import * as t from 'io-ts';

export const Tag = t.type({
  id: t.string,
  type: t.literal('tag'),
  attributes: t.type({
    name: t.string,
  }),
});

export type Tag = t.TypeOf<typeof Tag>;

export function decodeTag(object: unknown) {
  const either = Tag.decode(object);
  if (either._tag === 'Left') {
    console.error(`Tag: Invalid format`);
    throw either.left;
  }
  return either.right;
}
