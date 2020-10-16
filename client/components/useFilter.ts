import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { filterSelector, fetchFilter } from '@/modules/filter';
import { JsonAPIError } from '@/entities/JsonAPIError';
import { makeTuple } from '@/libs';

export const useFilter = (id: string | undefined) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<JsonAPIError[]>();
  const filter = useAppSelector((state) => id ? filterSelector.selectById(state, id) : undefined);

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const { errors } = await dispatch(fetchFilter(id || ''))
      setLoading(false);
      if (cleanuped) return;
      setErrors(errors);
    };
    if (id && !filter) fetchData();

    return () => { cleanuped = true; };
  }, [id, filter]);

  return makeTuple(loading, errors, filter);
};
