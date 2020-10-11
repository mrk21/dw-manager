import { FC, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchTagList, selectTags } from '@/modules/tag';
import { JsonAPIError } from '@/entities/JsonAPIError';
import Link from 'next/link'

export const TagList: FC = () => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<JsonAPIError[]>();

  const dispatch = useAppDispatch();
  const tags = useAppSelector(selectTags);

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const { errors } = await dispatch(fetchTagList({ per: 100 }));
      if (cleanuped) return;
      setLoading(false);
      if (errors) setErrors(errors);
    };
    fetchData();

    return () => { cleanuped = true; };
  }, []);

  const Content = (() => {
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
          <li key={tag.id}>
            <Link href={`/?tag_id=${tag.id}`}>{tag.attributes.name}</Link>
          </li>
        ))}
      </ul>
    );
  })();

  return (
    <div>
      <p>Tags</p>
      {Content}
    </div>
  );
};
