import { FC } from 'react';
import { ValidationFailedJsonAPIError } from '@/api/JsonAPIError';

type Props = {
  errors: ValidationFailedJsonAPIError | undefined;
  attribute: string;
};

export const ValidationError: FC<Props> = ({ errors, attribute }) => {
  if (!errors) {
    return <></>;
  }
  const messages = errors.meta.messages[attribute];
  if (!messages) {
    return <></>;
  }
  return (
    <>{messages.map(m => <p key={m}>{m}</p>)}</>
  );
};
