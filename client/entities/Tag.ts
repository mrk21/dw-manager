import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either'
import { IoTsValidationError } from '@/libs';

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
  if (isLeft(either)) throw new IoTsValidationError(either);
  return either.right;
}
