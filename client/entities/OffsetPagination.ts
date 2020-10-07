import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either'
import { IoTsValidationError } from '@/libs';

export const OffsetPagination = t.type({
  type: t.literal('offset'),
  data: t.type({
    total: t.number,
    current: t.number,
    next: t.union([ t.number, t.null ]),
    prev: t.union([ t.number, t.null ]),
    isFirst: t.boolean,
    isLast: t.boolean,
  }),
});

export type OffsetPagination = t.TypeOf<typeof OffsetPagination>;

export function decodeOffsetPagination(object: unknown) {
  const either = OffsetPagination.decode(object);
  if (isLeft(either)) throw new IoTsValidationError(either);
  return either.right;
}
