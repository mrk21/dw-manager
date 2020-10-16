import _uniq from 'lodash/uniq';
import _throttle from 'lodash/throttle';
import _debounce from 'lodash/debounce';
import _cloneDeep from 'lodash/cloneDeep';
import { Errors } from 'io-ts';
import { Left } from 'fp-ts/lib/Either';
import { PathReporter } from 'io-ts/lib/PathReporter';

export const uniq = _uniq;
export const debounce = _debounce;
export const throttle = _throttle;
export const cloneDeep = _cloneDeep;

export const compact = <T>(values: (T | undefined)[]) => (
  values.filter(v => typeof v !== 'undefined') as T[]
);

export const flatten = <T>(values: (T[][])) => (
  ([] as T[]).concat(...values)
);

export const compare = <T>(a: T, b: T) => (
  a == b ? 0 : a < b ? -1 : 1
);

export const makeTuple = <T extends any[]>(...values: [...T]): [...T] => values;

export class IoTsValidationError extends Error {
  constructor(either: Left<Errors>) {
    const messages = PathReporter.report(either).map((m) => `- ${m}`).join("\n\n");
    super(`IoTsValidationError:\n\n${messages}\n`);
  }
}
