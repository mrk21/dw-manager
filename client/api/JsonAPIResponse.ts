import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either'
import { IoTsValidationError } from '@/libs';
import { JsonAPIError } from './JsonAPIError';

class Type<Data> {
  decoder(types: { data: t.Type<Data> }) {
    return t.type({
      data: t.union([ types.data, t.undefined ]),
      errors: t.union([ t.array(JsonAPIError), t.undefined ]),
    });
  }
}

export const JsonAPIResponse = <Data>(types: { data: t.Type<Data> }) => {
  const type = new Type<Data>();
  return type.decoder(types);
};

export type JsonAPIResponse<Data> = t.TypeOf<ReturnType<Type<Data>['decoder']>>;

export function decodeJsonAPIResponse<Data>(object: unknown, types: { data: t.Type<Data> }) {
  const either = JsonAPIResponse(types).decode(object);
  if (isLeft(either)) throw new IoTsValidationError(either);
  return either.right;
}
