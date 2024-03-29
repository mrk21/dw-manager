import { JsonAPIError } from '@/api/JsonAPIError';
import { useMutation } from 'react-query';
import { signOut } from '@/api/sessions';

type Options = {
  onSuccess?: () => void;
  onError?: (errors: JsonAPIError[]) => void;
};

export const useSignOut = (options: Options = {}) => {
  return useMutation<null, JsonAPIError[]>(
    async () => {
      return await signOut();
    },
    {
      onSuccess: (_) => {
        if (options.onSuccess) options.onSuccess();
      },
      onError: (error) => {
        if (options.onError) options.onError(error);
      }
    }
  );
}
