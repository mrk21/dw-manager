import { useState } from 'react';
import { JsonAPIError } from '@/api/JsonAPIError';
import { OffsetPagination } from '@/api/OffsetPagination';
import { makeTuple } from '@/libs';
import { getTagList } from '@/api/tags';
import { UseQueryResult, useQuery } from 'react-query';
import { Tag } from '../../api/tags/Tag';
import { useMe } from '../session/useMe';

export const useAllTagList = ({ page = 1, per = 100 }: {
  page?: number;
  per?: number;
} = {}) => {
  const me = useMe();
  const [pageInfo, setPageInfo] = useState<OffsetPagination>();

  const { isLoading, error, data } = <UseQueryResult<Tag[], JsonAPIError[]>>useQuery(
    ['tags', 'page', page, 'per', per],
    async () => {
      const { data, errors, meta } = await getTagList({ page, per });
      if (errors) throw errors;
      setPageInfo(meta ? meta.page : undefined);
      return data;
    },
    {
      enabled: !!me.data,
    }
  );

  return makeTuple(isLoading, error || undefined, data || [], pageInfo);
};
