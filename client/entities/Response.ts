import * as t from 'io-ts';

class ResponseType<Data, Error> {
  decoder(types: { data: t.Type<Data>, error: t.Type<Error> }) {
    return t.type({
      data: t.union([ types.data, t.undefined ]),
      errors: t.union([ t.array(types.error), t.undefined ]),
    });
  }
}

export const Response = <Data, Error>(types: { data: t.Type<Data>, error: t.Type<Error> }) => {
  const type = new ResponseType<Data, Error>();
  return type.decoder(types);
};

export type Response<Data, Error> = t.TypeOf<ReturnType<ResponseType<Data, Error>['decoder']>>;

export function decodeResponse<Data, Error>(object: unknown, types: { data: t.Type<Data>, error: t.Type<Error> }) {
  const either = Response(types).decode(object);
  if (either._tag === 'Left') {
    console.error(`ArrayResponse<${types.data.name}, ${types.error.name}>: Invalid format`);
    throw either.left;
  }
  return either.right;
}
