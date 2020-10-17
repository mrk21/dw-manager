import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either'
import { IoTsValidationError } from '@/libs';

export const Filter = t.type({
  id: t.string,
  type: t.literal('filter'),
  attributes: t.type({
    name: t.string,
    condition: t.string,
  }),
});

export type Filter = t.TypeOf<typeof Filter>;

export function decodeFilter(object: unknown) {
  const either = Filter.decode(object);
  if (isLeft(either)) throw new IoTsValidationError(either);
  return either.right;
}

export const NewFilter = t.type({
  type: t.literal('filter'),
  attributes: t.type({
    name: t.string,
    condition: t.string,
  }),
});

export type NewFilter = t.TypeOf<typeof NewFilter>;
