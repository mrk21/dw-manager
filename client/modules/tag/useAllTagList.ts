import { useState } from 'react';
import { JsonAPIError } from '@/api/JsonAPIError';
import { OffsetPagination } from '@/api/OffsetPagination';
import { makeTuple } from '@/libs';
import { getTagList } from '@/api/tags';
import { useQuery } from 'react-query';
import { Tag } from '../../api/tags/Tag';
import { useHasMe } from '../session/useHasMe';

export const useAllTagList = ({ page = 1, per = 100 }: {
  page?: number;
  per?: number;
} = {}) => {
  const hasMe = useHasMe();
  const [pageInfo, setPageInfo] = useState<OffsetPagination>();

  const { isLoading, error, data } = useQuery<Tag[] | undefined, JsonAPIError[]>(
    ['tags', 'page', page, 'per', per],
    async () => {
      const { data, errors, meta } = await getTagList({ page, per });
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
