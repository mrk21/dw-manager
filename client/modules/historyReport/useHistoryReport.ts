import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchHistoryReport, selectHistoryReport } from '@/modules/historyReport';
import { JsonAPIError } from '@/api/JsonAPIError';
import { makeTuple } from '@/libs';
import { selectMe } from '../session';

export const useHistoryReport = ({ condition }: {
  condition?: string;
} = {}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<JsonAPIError[]>();
  const report = useAppSelector(selectHistoryReport);
  const me = useAppSelector(selectMe);

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const { errors } = await dispatch(fetchHistoryReport({ condition }));
      if (cleanuped) return;
      setErrors(errors);
      setLoading(false);
    };
    if (me && typeof condition !== 'undefined') fetchData();

    return () => {
      cleanuped = true;
      setLoading(false);
    };
  }, [me, condition]);

  return makeTuple(loading, errors, report);
};
