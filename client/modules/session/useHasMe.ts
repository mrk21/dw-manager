import { useQueryClient } from 'react-query';
import { User } from '../../api/sessions/User';

export const useHasMe = () => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(['session'])
  return !!user;
}
