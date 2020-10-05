export const compact = <T>(values: (T | undefined)[]) => (
  <T[]>values.filter((v) => typeof v !== 'undefined')
);

export const flatten = <T>(values: (T[][])) => (
  ([] as T[]).concat(...values)
);
