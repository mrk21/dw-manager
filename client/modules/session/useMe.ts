import { JsonAPIError } from '@/api/JsonAPIError';
import { getMe } from '@/api/sessions';
import { useQuery, UseQueryResult } from 'react-query';
import { User } from '../../api/sessions/User';

export const useMe = () => {
  const { isLoading, error, data } = <UseQueryResult<User, JsonAPIError[]>>useQuery(
    ['session'],
    async () => {
      const { data, errors } = await getMe();
      if (errors) throw errors;
      return data;
    },
    {
      retry: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchInterval: false,
    }
  );

  return {
    isLoading: isLoading,
    errors: error || undefined,
    data: data,
  };
};
