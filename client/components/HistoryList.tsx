import { FC, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchHistoryList, historySelector } from '@/modules/history';
import { JsonAPIError } from '@/entities/JsonAPIError';
import { HistoryTagList } from '@/components/HistoryTagList'
import Pagination from '@material-ui/lab/Pagination';
import { PaginationProps } from '@material-ui/lab/Pagination/Pagination';

export const HistoryList: FC = () => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<JsonAPIError[]>();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const dispatch = useAppDispatch();
  const histories = useAppSelector(historySelector.selectAll);
  const onChange: PaginationProps['onChange'] = (_, page) => setPage(page);

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const { errors, meta } = await dispatch(fetchHistoryList({ page }));
      if (cleanuped) return;
      setLoading(false);
      if (errors) setErrors(errors);
      setTotalPage(meta.page.data.total);
    };
    fetchData();

    return () => { cleanuped = true; };
  }, [page]);

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
      <Pagination count={totalPage} page={page} onChange={onChange} />
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
