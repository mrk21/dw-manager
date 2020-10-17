import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchFilterList, filterSelector } from '@/modules/filter';
import { JsonAPIError } from '@/api/JsonAPIError';
import { OffsetPagination } from '@/api/OffsetPagination';
import { makeTuple } from '@/libs';
import { sessionSelectors } from '../session';

export const useAllFilterList = ({ page = 1, per = 100 }: {
  page?: number;
  per?: number;
} = {}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<JsonAPIError[]>();
  const [pageInfo, setPageInfo] = useState<OffsetPagination>();
  const filters = useAppSelector(filterSelector.selectAll);
  const me = useAppSelector(sessionSelectors.me);

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const { errors, meta } = await dispatch(fetchFilterList({ page, per }));
      if (cleanuped) return;
      setErrors(errors);
      setPageInfo(meta ? meta.page : undefined);
      setLoading(false);
    };
    if (me) fetchData();

    return () => {
      cleanuped = true;
      setLoading(false);
    };
  }, [me, page, per]);

  return makeTuple(loading, errors, filters, pageInfo);
};
