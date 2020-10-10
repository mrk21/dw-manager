import * as t from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either'
import { IoTsValidationError } from '@/libs';
import { JsonAPIError } from './JsonAPIError';

class Type<Data, Meta> {
  decoder(types: { data: t.Type<Data>, meta: t.Type<Meta> }) {
    return t.type({
      data: t.union([ t.array(types.data), t.undefined ]),
      errors: t.union([ t.array(JsonAPIError), t.undefined ]),
      meta: t.union([ types.meta, t.undefined ]),
    });
  }
}

export const JsonAPIArrayResponse = <Data, Meta>(types: { data: t.Type<Data>, meta: t.Type<Meta> }) => {
  const type = new Type<Data, Meta>();
  return type.decoder(types);
};
export type JsonAPIArrayResponse<Data, Meta> = t.TypeOf<ReturnType<Type<Data, Meta>['decoder']>>;

export function decodeJsonAPIArrayResponse<Data, Meta>(object: unknown, types: { data: t.Type<Data>, meta: t.Type<Meta> }) {
  const either = JsonAPIArrayResponse(types).decode(object);
  if (isLeft(either)) throw new IoTsValidationError(either);
  return either.right;
}
