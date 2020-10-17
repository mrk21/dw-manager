import * as t from 'io-ts';

export const GenericJsonAPIError = t.type({
  code: t.union([
    t.literal('internal_server_error'),
    t.literal('authentication_error'),
    t.literal('session_expired'),
    t.literal('not_found'),
    t.literal('too_many_request'),
  ]),
  title: t.string,
});
export type GenericJsonAPIError = t.TypeOf<typeof GenericJsonAPIError>;

export const ValidationFailedJsonAPIError = t.type({
  code: t.literal('validation_failed'),
  title: t.string,
  source: t.type({
    pointer: t.string
  }),
  meta: t.type({
    messages: t.record(t.string, t.union([ t.array(t.string), t.undefined ])),
  })
});
export type ValidationFailedJsonAPIError = t.TypeOf<typeof ValidationFailedJsonAPIError>;

export const JsonAPIError = t.union([
  GenericJsonAPIError,
  ValidationFailedJsonAPIError,
]);
export type JsonAPIError = t.TypeOf<typeof JsonAPIError>;

export const extractValidationFailed = (errors: JsonAPIError[]) => {
  type VF = ValidationFailedJsonAPIError;
  return errors.filter((e) => e.code === 'validation_failed')[0] as VF | undefined;
};
