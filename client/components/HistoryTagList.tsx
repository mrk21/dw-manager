import React, { FC, useState } from 'react';
import { useAppSelector, useAppDispatch, useDidMount } from '@/hooks';
import { fetchTag, tagSelector } from '@/modules/tag';
import { History } from '@/entities/History';
import { compact } from '@/libs';

export type HistoryTagListProps = {
  history: History
};

const HistoryTagList: FC<HistoryTagListProps> = ({ history }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const tagIds = history.relationships.tags.data.map(({ id }) => id);
  const tags = useAppSelector((state) => (
    compact(
      tagIds.map((id) => tagSelector.selectById(state, id))
    )
  ));

  useDidMount(async () => {
    setLoading(true);
    await Promise.all(tagIds.map((id) => dispatch(fetchTag(id))));
    setLoading(false);
  });

  if (loading) {
    return (
      <p>loading...</p>
    );
  }

  return (
    <ul>
      {tags.map((tag) => (
        <li key={tag.id}><p>{tag.attributes.name}:</p></li>
      ))}
    </ul>
  );
};

export default HistoryTagList;
