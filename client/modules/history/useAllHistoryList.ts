import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchHistoryList, historySelector } from '@/modules/history';
import { JsonAPIError } from '@/api/JsonAPIError';
import { OffsetPagination } from '@/api/OffsetPagination';
import { makeTuple } from '@/libs';
import { sessionSelectors } from '../session';

export const useAllHistoryList = ({ condition, page = 1, per = 20 }: {
  condition?: string;
  page?: number;
  per?: number;
} = {}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<JsonAPIError[]>();
  const [meta, setMeta] = useState<{ page: OffsetPagination; }>();
  const histories = useAppSelector(historySelector.selectAll);
  const me = useAppSelector(sessionSelectors.me);

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const { errors, meta } = await dispatch(fetchHistoryList({ condition, page, per }));
      if (cleanuped) return;
      setErrors(errors);
      setMeta(meta);
      setLoading(false);
    };
    if (me && typeof condition !== 'undefined') fetchData();

    return () => {
      cleanuped = true;
      setLoading(false);
    };
  }, [me, condition, page, per]);

  return makeTuple(loading, errors, histories, meta);
};
