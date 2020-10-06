import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either'
import { JsonAPIResponse } from './JsonAPIResponse';
import { JsonAPIError } from './JsonAPIError';
import { IoTsValidationError } from '@/libs';

class Type<Data, Error> {
  decoder(types: { data: t.Type<Data>, error: t.Type<Error> }) {
    return JsonAPIResponse({
       data: t.record(t.string, JsonAPIResponse(types)),
       error: JsonAPIError
    });
  }
}

export const JsonAPIBatchedResponse = <Data, Error>(types: { data: t.Type<Data>, error: t.Type<Error> }) => {
  const type = new Type<Data, Error>();
  return type.decoder(types);
};

export type JsonAPIBatchedResponse<Data, Error> = t.TypeOf<ReturnType<Type<Data, Error>['decoder']>>;

export function decodeJsonAPIBatchedResponse<Data, Error>(object: unknown, types: { data: t.Type<Data>, error: t.Type<Error> }) {
  const either = JsonAPIBatchedResponse(types).decode(object);
  if (isLeft(either)) throw new IoTsValidationError(either);
  return either.right;
}
