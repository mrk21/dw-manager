import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { filterSelector, fetchFilter } from '@/modules/filter';
import { JsonAPIError } from '@/api/JsonAPIError';
import { makeTuple } from '@/libs';
import { sessionSelectors } from '../session';

export const useFilter = (id: string | undefined) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<JsonAPIError[]>();
  const filter = useAppSelector((state) => id ? filterSelector.selectById(state, id) : undefined);
  const me = useAppSelector(sessionSelectors.me);

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const { errors } = await dispatch(fetchFilter(id || ''))
      if (cleanuped) return;
      setErrors(errors);
      setLoading(false);
    };
    if (me && id && !filter) fetchData();

    return () => {
      cleanuped = true;
      setLoading(false);
    };
  }, [me, id, filter]);

  return makeTuple(loading, errors, filter);
};
