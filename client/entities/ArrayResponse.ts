import * as t from 'io-ts';

class ArrayResponseType<Data, Error> {
  decoder(types: { data: t.Type<Data>, error: t.Type<Error> }) {
    return t.type({
      data: t.union([ t.array(types.data), t.undefined ]),
      errors: t.union([ t.array(types.error), t.undefined ]),
    });
  }
}

export const ArrayResponse = <Data, Error>(types: { data: t.Type<Data>, error: t.Type<Error> }) => {
  const type = new ArrayResponseType<Data, Error>();
  return type.decoder(types);
};

export type ArrayResponse<Data, Error> = t.TypeOf<ReturnType<ArrayResponseType<Data, Error>['decoder']>>;

export function decodeArrayResponse<Data, Error>(object: unknown, types: { data: t.Type<Data>, error: t.Type<Error> }) {
  const either = ArrayResponse(types).decode(object);
  if (either._tag === 'Left') {
    console.error(`ArrayResponse<${types.data.name}, ${types.error.name}>: Invalid format`);
    throw either.left;
  }
  return either.right;
}
