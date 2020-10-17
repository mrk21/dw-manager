import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectTagById, fetchTag } from '@/modules/tag';
import { JsonAPIError } from '@/api/JsonAPIError';
import { makeTuple } from '@/libs';

export const useTag = (id: string | undefined) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<JsonAPIError[]>();
  const tag = useAppSelector((state) => id ? selectTagById(state, id) : undefined);

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const errors = await dispatch(fetchTag(id || ''));
      if (cleanuped) return;
      setErrors(errors);
      setLoading(false);
    };
    if (id && !tag) fetchData();

    return () => {
      cleanuped = true;
      setLoading(false);
    };
  }, [id, tag]);

  return makeTuple(loading, errors, tag);
};
