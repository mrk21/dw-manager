import { FC, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchHistoryList, historySelector } from '@/modules/history';
import { JsonAPIError } from '@/entities/JsonAPIError';
import { HistoryTagList } from '@/components/HistoryTagList'

export const HistoryList: FC = () => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<JsonAPIError[]>();

  const dispatch = useAppDispatch();
  const histories = useAppSelector(historySelector.selectAll);

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const e = await dispatch(fetchHistoryList());
      if (cleanuped) return;
      setLoading(false);
      if (e) setErrors(e);
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
