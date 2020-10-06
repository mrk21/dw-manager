import { FC, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchTag, selectTagById } from '@/modules/tag';
import { History } from '@/entities/History';
import { compact, flatten } from '@/libs';
import { JsonAPIError } from '@/entities/JsonAPIError';

type Props = {
  history: History
};

export const HistoryTagList: FC<Props> = ({ history }) => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<JsonAPIError[]>();

  const dispatch = useAppDispatch();
  const tagIds = history.relationships.tags.data.map(({ id }) => id);
  const tags = compact(tagIds.map((id) =>
    useAppSelector((state) => selectTagById(state, id))
  ));

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const e = flatten(compact(
          await Promise.all(
            tagIds.map((id) => dispatch(fetchTag(id)))
          )
        ));
        if (cleanuped) return;
        if (e.length > 0) setErrors(e);
        setLoading(false);
      }
      catch(e) {
        console.error(e);
        setLoading(false);
      }
    };
    fetchData();

    return () => { cleanuped = true; };
  }, []);

  if (loading) {
    return (
      <p>loading...</p>
    );
  }

  if (errors) {
    return (
      <div>
        {errors.map((e, i) => (
          <p key={i}>{e.title}</p>
        ))}
      </div>
    );
  }

  return (
    <ul>
      {tags.map((tag) => (
        <li key={tag.id}><p>{tag.attributes.name}</p></li>
      ))}
    </ul>
  );
};
