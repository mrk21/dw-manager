import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either'
import { IoTsValidationError } from '@/libs';

export const HistoryReport = t.type({
  id: t.string,
  type: t.literal('historyReport'),
  attributes: t.type({
    period: t.string,
    periodType: t.union([t.literal('monthly'), t.literal('yearly')]),
    pamount: t.number,
    namount: t.number,
    amount: t.number,
  })
});

export type HistoryReport = t.TypeOf<typeof HistoryReport>;

export function decodeHistoryReport(object: unknown) {
  const either = HistoryReport.decode(object);
  if (isLeft(either)) throw new IoTsValidationError(either);
  return either.right;
}
