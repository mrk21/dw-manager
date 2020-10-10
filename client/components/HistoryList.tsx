import { FC, useState, useEffect, useCallback, useRef, ChangeEvent } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchHistoryList, historySelector } from '@/modules/history';
import { JsonAPIError } from '@/entities/JsonAPIError';
import { HistoryTagList } from '@/components/HistoryTagList'
import { throttle } from '@/libs';
import { FilterCreationForm } from '@/components/FilterCreationForm';

export const HistoryList: FC = () => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<JsonAPIError[]>();
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const [condition, setCondition] = useState('');
  const [isOpendDialog, setIsOpendDialog] = useState(false);

  const dispatch = useAppDispatch();
  const histories = useAppSelector(historySelector.selectAll);

  const searchBar = useRef<HTMLInputElement>(null);
  const setConditionThrottled = useCallback(throttle((value: string) => setCondition(value), 1000), []);
  const onChangePage = useCallback((_, page: number) => setPage(page), []);
  const onChangeCondition = useCallback((e: ChangeEvent<HTMLInputElement>) => setConditionThrottled(e.target.value), []);
  const onChangeConditionForFilterForm = useCallback((value: string) => {
    setConditionThrottled(value);
    if (searchBar.current) searchBar.current.value = value;
  }, []);

  const onOpenDialog = useCallback((_: any) => setIsOpendDialog(true), []);
  const onCloseDialog = useCallback((_: any) => setIsOpendDialog(false), []);

  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const { errors, meta } = await dispatch(fetchHistoryList({ condition, page }));
      if (cleanuped) return;
      setLoading(false);
      if (errors) setErrors(errors);
      if (meta) setTotalPage(meta.page.data.total);
    };
    fetchData();

    return () => { cleanuped = true; };
  }, [page, condition]);

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
  })();

  return (
    <div>
      <input ref={searchBar} type="text" size={100} defaultValue={condition} onInput={onChangeCondition} onChange={onChangeCondition} />
      <button type="button" onClick={onOpenDialog}>create filter</button>
      <FilterCreationForm
        condition={condition}
        isOpen={isOpendDialog}
        onClose={onCloseDialog}
        onChangeCondition={onChangeConditionForFilterForm}
      />
      <Pagination count={totalPage} page={page} onChange={onChangePage} />
      {Content}
    </div>
  );
};
