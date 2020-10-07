import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either'
import { IoTsValidationError } from '@/libs';

class Type<Data, Error, Meta> {
  decoder(types: { data: t.Type<Data>, error: t.Type<Error>, meta: t.Type<Meta> }) {
    return t.type({
      data: t.union([ t.array(types.data), t.undefined ]),
      errors: t.union([ t.array(types.error), t.undefined ]),
      meta: types.meta,
    });
  }
}

export const JsonAPIArrayResponse = <Data, Error, Meta>(types: { data: t.Type<Data>, error: t.Type<Error>, meta: t.Type<Meta> }) => {
  const type = new Type<Data, Error, Meta>();
  return type.decoder(types);
};
export type JsonAPIArrayResponse<Data, Error, Meta> = t.TypeOf<ReturnType<Type<Data, Error, Meta>['decoder']>>;

export function decodeJsonAPIArrayResponse<Data, Error, Meta>(object: unknown, types: { data: t.Type<Data>, error: t.Type<Error>, meta: t.Type<Meta> }) {
  const either = JsonAPIArrayResponse(types).decode(object);
  if (isLeft(either)) throw new IoTsValidationError(either);
  return either.right;
}
