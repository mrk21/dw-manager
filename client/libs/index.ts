export const compact = <T>(values: (T | undefined)[]) => (
  <T[]>values.filter((v) => typeof v !== 'undefined')
);
