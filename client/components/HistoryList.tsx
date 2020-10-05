import React, { FC, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppSelector, useAppDispatch, useDidMount } from '@/hooks';
import { fetchHistoryList, historySelector } from '@/modules/history';
import { APIError } from '@/entities/APIError';
import HistoryTagList from '@/components/HistoryTagList'

const HistoryList: FC = () => {
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<APIError[]>();
  const [loading, setLoading] = useState(true);
  const histories = useAppSelector(historySelector.selectAll, shallowEqual);

  useDidMount(async () => {
    setLoading(true);
    const e = await dispatch(fetchHistoryList());
    setLoading(false);
    if (e) setErrors(e);
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
      {histories.map((history) => (
        <li key={history.id}>
          <b>{history.attributes.date}:</b>&nbsp;
          <span>{history.attributes.title}</span>&nbsp;
          <span>{history.attributes.amount}</span>
          <HistoryTagList history={history} />
        </li>
      ))}
    </ul>
  );
};

export default HistoryList;
