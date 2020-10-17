import { FC } from 'react';
import { JsonAPIError } from '@/api/JsonAPIError';

type Props = {
  errors: JsonAPIError[];
};

export const Errors: FC<Props> = ({ errors }) => {
  return (
    <div>
      {errors.map((e, i) => (
        <p key={i}>{e.title}</p>
      ))}
    </div>
  );
};
