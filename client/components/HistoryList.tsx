import { FC, useState, useEffect, ChangeEvent, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchHistoryList, historySelector } from '@/modules/history';
import { JsonAPIError } from '@/entities/JsonAPIError';
import { HistoryTagList } from '@/components/HistoryTagList'
import Pagination from '@material-ui/lab/Pagination';
import { PaginationProps } from '@material-ui/lab/Pagination/Pagination';
import { throttle } from '@/libs';

export const HistoryList: FC = () => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<JsonAPIError[]>();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [condition, setCondition] = useState('');

  const setConditionThrottledRef = useRef(throttle((value: string) => {
    setCondition(value);
  }, 2000));

  const dispatch = useAppDispatch();
  const histories = useAppSelector(historySelector.selectAll);
  const onChangePage: PaginationProps['onChange'] = (_, page) => setPage(page);
  const onInputCondition = (e: ChangeEvent<HTMLInputElement>) => setConditionThrottledRef.current(e.target.value);

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const { errors, meta } = await dispatch(fetchHistoryList({ condition, page }));
      if (cleanuped) return;
      setLoading(false);
      if (errors) setErrors(errors);
      setTotalPage(meta.page.data.total);
    };
    fetchData();

    return () => { cleanuped = true; };
  }, [page, condition]);

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
    <>
      <input type="text" size={100} defaultValue={condition} onInput={onInputCondition} onChange={onInputCondition} />
      <Pagination count={totalPage} page={page} onChange={onChangePage} />
      {loading ? (
        <p>loading...</p>
      ) : (
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
      )}
    </>
  );
};
