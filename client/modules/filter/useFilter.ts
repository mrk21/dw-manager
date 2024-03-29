import { JsonAPIError } from '@/api/JsonAPIError';
import { makeTuple } from '@/libs';
import { getFilter } from '../../api/filters/index';
import { Filter } from '../../api/filters/Filter';
import { useQuery } from 'react-query';
import { useHasMe } from '../session/useHasMe';

export const useFilter = (id: string | undefined) => {
  const hasMe = useHasMe();

  const { isLoading, error, data } = useQuery<Filter | undefined, JsonAPIError[]>(
    ['filter', id || '-'],
    async () => {
      const { data, errors } = await getFilter(id || '-');
      if (errors) throw errors;
      return data;
    },
    {
      enabled: hasMe && !!id,
    }
  );

  return makeTuple(isLoading, error || undefined, data);
};
