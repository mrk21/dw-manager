import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either'
import { JsonAPIResponse } from './JsonAPIResponse';
import { IoTsValidationError } from '@/libs';

class Type<Data> {
  decoder(types: { data: t.Type<Data> }) {
    return JsonAPIResponse({
       data: t.record(t.string, JsonAPIResponse(types))
    });
  }
}

export const JsonAPIBatchedResponse = <Data>(types: { data: t.Type<Data> }) => {
  const type = new Type<Data>();
  return type.decoder(types);
};

export type JsonAPIBatchedResponse<Data> = t.TypeOf<ReturnType<Type<Data>['decoder']>>;

export function decodeJsonAPIBatchedResponse<Data>(object: unknown, types: { data: t.Type<Data> }) {
  const either = JsonAPIBatchedResponse(types).decode(object);
  if (isLeft(either)) throw new IoTsValidationError(either);
  return either.right;
}
