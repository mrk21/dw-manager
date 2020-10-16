import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { selectTagById, fetchTag } from '@/modules/tag';
import { JsonAPIError } from '@/entities/JsonAPIError';
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
      const errors = await dispatch(fetchTag(id || ''))
      setLoading(false);
      if (cleanuped) return;
      setErrors(errors);
    };
    if (id && !tag) fetchData();

    return () => { cleanuped = true; };
  }, [id, tag]);

  return makeTuple(loading, errors, tag);
};
