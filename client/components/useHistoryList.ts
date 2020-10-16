import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchHistoryList, historySelector } from '@/modules/history';
import { JsonAPIError } from '@/entities/JsonAPIError';
import { OffsetPagination } from '@/entities/OffsetPagination';
import { makeTuple } from '@/libs';

export const useHistoryList = ({ condition, page }: {
  condition?: string;
  page: number;
}) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<JsonAPIError[]>();
  const [pageInfo, setPageInfo] = useState<OffsetPagination>();

  const histories = useAppSelector(historySelector.selectAll);

  // fetch histories
  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const { errors, meta } = await dispatch(fetchHistoryList({ condition, page }));
      setLoading(false);
      if (cleanuped) return;
      setErrors(errors);
      setPageInfo(meta ? meta.page : undefined);
    };
    if (typeof condition !== 'undefined') fetchData();

    return () => { cleanuped = true; };
  }, [condition, page]);

  return makeTuple(loading, errors, histories, pageInfo);
};
