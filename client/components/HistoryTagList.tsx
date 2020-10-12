import { FC, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchTag, selectTagById } from '@/modules/tag';
import { History } from '@/entities/History';
import { compact, flatten } from '@/libs';
import { JsonAPIError } from '@/entities/JsonAPIError';
import Chip from '@material-ui/core/Chip';
import Link from 'next/link';

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
    <div>
      {tags.map((tag) => (
        <><Link href={`/?tag_id=${tag.id}`}><Chip key={tag.id} size="small" label={tag.attributes.name} clickable /></Link>&nbsp;</>
      ))}
    </div>
  );
};
