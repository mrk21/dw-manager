import { JsonAPIError } from '@/api/JsonAPIError';
import { signIn } from '@/api/sessions';
import { useMutation, useQueryClient } from 'react-query';
import { User } from '../../api/sessions/User';

type Options = {
  onSuccess?: (user: User) => void;
  onError?: (errors: JsonAPIError[]) => void;
};

export const useSignIn = (options: Options = {}) => {
  const queryClient = useQueryClient();
  type Variables = { email: string, password: string };

  return useMutation<User, JsonAPIError[], Variables>(
    async (auth) => {
      const { data, errors } = await signIn(auth);
      if (errors) throw errors;
      return data as NonNullable<typeof data>;
    },
    {
      onSuccess: (user) => {
        queryClient.setQueryData(['session'], user);
        if (options.onSuccess) options.onSuccess(user);
      },
      onError: (error) => {
        if (options.onError) options.onError(error);
      }
    }
  );
}
