import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchMe, selectMe } from '@/modules/session';
import { JsonAPIError } from '@/api/JsonAPIError';
import { makeTuple } from '@/libs';

export const useMe = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<JsonAPIError[]>();
  const me = useAppSelector(selectMe);

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const result = await dispatch(fetchMe());
      if (cleanuped) return;
      setErrors(result.errors);
      setLoading(false);
    };
    if (!me) fetchData();

    return () => {
      cleanuped = true;
      setErrors(undefined);
      setLoading(false);
    };
  }, [me]);

  return makeTuple(loading, errors, me);
};
