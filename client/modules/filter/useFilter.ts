import { JsonAPIError } from '@/api/JsonAPIError';
import { makeTuple } from '@/libs';
import { getFilter } from '../../api/filters/index';
import { Filter } from '../../api/filters/Filter';
import { UseQueryResult, useQuery } from 'react-query';
import { useMe } from '../session/useMe';

export const useFilter = (id: string | undefined) => {
  const me = useMe();

  const { isLoading, error, data } = <UseQueryResult<Filter, JsonAPIError[]>>useQuery(
    ['filter', id || '-'],
    async () => {
      const { data, errors } = await getFilter(id || '-');
      if (errors) throw errors;
      return data;
    },
    {
      enabled: !!me.data && !!id,
    }
  );

  return makeTuple(isLoading, error || undefined, data);
};
