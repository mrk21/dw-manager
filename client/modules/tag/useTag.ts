import { useAppDispatch } from '@/store/hooks';
import { JsonAPIError } from '@/api/JsonAPIError';
import { makeTuple } from '@/libs';
import { getByIDBatched } from '../../api/batched';
import { batchGetTag } from '@/api/tags';
import { jsonAPIErrorsToFlash } from '../flash/index';
import { UseQueryResult, useQuery } from 'react-query';
import { Tag } from '../../api/tags/Tag';
import { useHasMe } from '../session/useHasMe';

export const useTag = (id: string | undefined) => {
  const hasMe = useHasMe();
  const dispatch = useAppDispatch();
  const batched = getByIDBatched(batchGetTag, jsonAPIErrorsToFlash(dispatch));

  const { isLoading, error, data } = <UseQueryResult<Tag, JsonAPIError[]>>useQuery(
    ['tag', id || '-'],
    async () => {
      const { data, errors } = await batched(id || '-');
      if (errors) throw errors;
      return data;
    },
    {
      enabled: hasMe && !!id,
      staleTime: 10 * 1000,
    }
  );

  return makeTuple(isLoading, error || undefined, data);
};
