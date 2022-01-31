import { useAppDispatch } from '@/store/hooks';
import { JsonAPIError } from '@/api/JsonAPIError';
import { Tag } from '@/api/tags/Tag';
import { compact, flatten, makeTuple } from '@/libs';
import { batchGetTag } from '@/api/tags';
import { useQueries, UseQueryOptions } from 'react-query';
import { getByIDBatched } from '../../api/batched';
import { jsonAPIErrorsToFlash } from '../flash/index';
import { useHasMe } from '../session/useHasMe';

export const useTagList = (ids: string[]) => {
  const hasMe = useHasMe();
  const dispatch = useAppDispatch();
  const batched = getByIDBatched(batchGetTag, jsonAPIErrorsToFlash(dispatch));

  const results = useQueries(
    ids.map((id): UseQueryOptions<Tag | undefined, JsonAPIError[]> => ({
      queryKey: ['tag', id],
      queryFn: async () => {
        const { data, errors } = await batched(id || '-');
        if (errors) throw errors;
        return data;
      },
      enabled: hasMe,
      staleTime: 10 * 1000,
    }))
  );
  const tags = compact(results.map(r => r.data));
  const errors = flatten(compact(results.map(r => r.error || undefined)));
  const isLoading = results.some(r => r.isLoading);

  return makeTuple(isLoading, errors.length > 0 ? errors : undefined, tags);
};
