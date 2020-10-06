import _uniq from 'lodash/uniq';
import _throttle from 'lodash/throttle';
import _debounce from 'lodash/debounce';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { Errors } from 'io-ts';
import { Left } from 'fp-ts/lib/Either';

export const compact = <T>(values: (T | undefined)[]) => (
  values.filter((v) => typeof v !== 'undefined') as T[]
);

export const flatten = <T>(values: (T[][])) => (
  ([] as T[]).concat(...values)
);

export const compare = <T>(a: T, b: T) => (
  a == b ? 0 : a < b ? -1 : 1
);

export const uniq = _uniq;
export const debounce = _debounce;
export const throttle = _throttle;

export class IoTsValidationError extends Error {
  constructor(either: Left<Errors>) {
    const messages = PathReporter.report(either).map((m) => `- ${m}`).join("\n\n");
    super(`IoTsValidationError\n\n${messages}`);
  }
}
