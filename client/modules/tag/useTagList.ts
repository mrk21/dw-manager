import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchTag, selectTagById } from '@/modules/tag';
import { JsonAPIError } from '@/api/JsonAPIError';
import { compact, flatten, makeTuple } from '@/libs';

export const useTagList = (ids: string[]) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<JsonAPIError[]>();
  const tags = useAppSelector((state) => compact(ids.map(id => selectTagById(state, id))));

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const e = flatten(compact(
        await Promise.all(
          ids.map(id => dispatch(fetchTag(id)))
        )
      ));
      if (cleanuped) return;
      setErrors(e.length > 0 ? e : undefined);
      setLoading(false);
    };
    if (tags.length !== ids.length) fetchData();

    return () => {
      cleanuped = true;
      setLoading(false);
    };
  }, [ids, tags]);

  return makeTuple(loading, errors, tags);
};
