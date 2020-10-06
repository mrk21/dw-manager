import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either'
import { IoTsValidationError } from '@/libs';

class Type<Data, Error> {
  decoder(types: { data: t.Type<Data>, error: t.Type<Error> }) {
    return t.type({
      data: t.union([ types.data, t.undefined ]),
      errors: t.union([ t.array(types.error), t.undefined ]),
    });
  }
}

export const JsonAPIResponse = <Data, Error>(types: { data: t.Type<Data>, error: t.Type<Error> }) => {
  const type = new Type<Data, Error>();
  return type.decoder(types);
};

export type JsonAPIResponse<Data, Error> = t.TypeOf<ReturnType<Type<Data, Error>['decoder']>>;

export function decodeJsonAPIResponse<Data, Error>(object: unknown, types: { data: t.Type<Data>, error: t.Type<Error> }) {
  const either = JsonAPIResponse(types).decode(object);
  if (isLeft(either)) throw new IoTsValidationError(either);
  return either.right;
}
