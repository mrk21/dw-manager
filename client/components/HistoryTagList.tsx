import React, { FC, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppSelector, useAppDispatch, useDidMount } from '@/hooks';
import { fetchTag, tagSelector } from '@/modules/tag';
import { History } from '@/entities/History';
import { compact, flatten } from '@/libs';
import { APIError } from '@/entities/APIError';

export type HistoryTagListProps = {
  history: History
};

const HistoryTagList: FC<HistoryTagListProps> = ({ history }) => {
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<APIError[]>();
  const [loading, setLoading] = useState(true);
  const tagIds = history.relationships.tags.data.map(({ id }) => id);
  const tags = useAppSelector((state) => (
    compact(
      tagIds.map((id) => tagSelector.selectById(state, id))
    )
  ), shallowEqual);

  useDidMount(async () => {
    setLoading(true);
    const e = flatten(compact(
      await Promise.all(
        tagIds.map((id) => dispatch(fetchTag(id)))
      )
    ));
    if (e.length > 0) setErrors(e);
    setLoading(false);
  });

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

export default HistoryTagList;
