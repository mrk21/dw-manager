import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectTagById, fetchTag } from '@/modules/tag';
import { JsonAPIError } from '@/api/JsonAPIError';
import { makeTuple } from '@/libs';
import { selectMe } from '../session';

export const useTag = (id: string | undefined) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<JsonAPIError[]>();
  const tag = useAppSelector((state) => id ? selectTagById(state, id) : undefined);
  const me = useAppSelector(selectMe);

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const errors = await dispatch(fetchTag(id || ''));
      if (cleanuped) return;
      setErrors(errors);
      setLoading(false);
    };
    if (me && id && !tag) fetchData();

    return () => {
      cleanuped = true;
      setLoading(false);
    };
  }, [me, id, tag]);

  return makeTuple(loading, errors, tag);
};
