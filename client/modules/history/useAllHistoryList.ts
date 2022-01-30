import { useState } from 'react';
import { JsonAPIError } from '@/api/JsonAPIError';
import { OffsetPagination } from '@/api/OffsetPagination';
import { makeTuple } from '@/libs';
import { UseQueryResult, useQuery } from 'react-query';
import { getHistoryList } from '@/api/histories';
import { useMe } from '../session/useMe';
import { History } from '@/api/histories/History';

export const useAllHistoryList = ({ condition, page = 1, per = 20 }: {
  condition?: string;
  page?: number;
  per?: number;
} = {}) => {
  const me = useMe();
  const [meta, setMeta] = useState<{ page: OffsetPagination; }>();

  const { isLoading, error, data } = <UseQueryResult<History[], JsonAPIError[]>>useQuery(
    ['histories', 'condition', condition, 'page', page, 'per', per],
    async () => {
      const { data, errors, meta } = await getHistoryList({ condition, page, per });
      if (errors) throw errors;
      setMeta(meta);
      return data;
    },
    {
      enabled: !!me.data,
    }
  );

  return makeTuple(isLoading, error || undefined, data || [], meta);
};
