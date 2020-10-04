import React, { FC, useState } from 'react';
import { useAppSelector, useAppDispatch, useDidMount } from '@/hooks';
import { fetchHistoryList, historySelector } from '@/modules/history';
import { APIError } from '@/entities/APIError';
import HistoryTagList from '@/components/HistoryTagList'

const HistoryList: FC = () => {
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<APIError[]>();
  const [loading, setLoading] = useState(true);
  const histories = useAppSelector(historySelector.selectAll);

  useDidMount(async () => {
    setLoading(true);
    const e = await dispatch(fetchHistoryList());
    setLoading(false);
    if (e) setErrors(e);
  });

  if (errors) {
    return (
      <div>
        {errors.map((e, i) => (
          <p key={i}>{e.title}</p>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <p>loading...</p>
    );
  }

  return (
    <ul>
      {histories.map((history) => (
        <li key={history.id}>
          <b>{history.attributes.date}:</b>
          <span>{history.attributes.title}</span>
          <HistoryTagList history={history} />
        </li>
      ))}
    </ul>
  );
};

export default HistoryList;
