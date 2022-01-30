import { useState } from 'react';
import { JsonAPIError } from '@/api/JsonAPIError';
import { OffsetPagination } from '@/api/OffsetPagination';
import { makeTuple } from '@/libs';
import { UseQueryResult, useQuery } from 'react-query';
import { Filter } from '../../api/filters/Filter';
import { getFilterList } from '../../api/filters/index';
import { useHasMe } from '../session/useHasMe';

export const useAllFilterList = ({ page = 1, per = 100 }: {
  page?: number;
  per?: number;
} = {}) => {
  const hasMe = useHasMe();
  const [pageInfo, setPageInfo] = useState<OffsetPagination>();

  const { isLoading, error, data } = <UseQueryResult<Filter[], JsonAPIError[]>>useQuery(
    ['filters', 'page', page, 'per', per],
    async () => {
      const { data, errors, meta } = await getFilterList({ page, per });
      if (errors) throw errors;
      setPageInfo(meta ? meta.page : undefined);
      return data;
    },
    {
      enabled: hasMe
    }
  );

  return makeTuple(isLoading, error || undefined, data || [], pageInfo);
};
