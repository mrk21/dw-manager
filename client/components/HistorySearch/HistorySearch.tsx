import { FC, useState, useEffect, useCallback } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchHistoryList, historySelector } from '@/modules/history';
import { JsonAPIError } from '@/entities/JsonAPIError';
import { throttle } from '@/libs';
import { filterSelector } from '@/modules/filter';
import { selectTagById } from '@/modules/tag';
import { Errors } from '@/components/Errors';
import { Indicator } from '@/components/Indicator';
import { ConditionForm } from './ConditionForm';
import { HistoryList } from './HistoryList';

export type HistorySearchProps = {
  tagId?: string;
  filterId?: string;
};

export const HistorySearch: FC<HistorySearchProps> = ({ tagId, filterId }) => {
  const dispatch = useAppDispatch();

  // fetch state
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<JsonAPIError[]>();

  // histories
  const histories = useAppSelector(historySelector.selectAll);

  // tag, filter
  const filter = useAppSelector((state) => filterSelector.selectById(state, filterId || ''));
  const tag = useAppSelector((state) => selectTagById(state, tagId || ''));

  // condition
  const [condition, setCondition] = useState('');
  const setConditionThrottled = useCallback(throttle((value: string) => setCondition(value), 1000), []);

  // paginations
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const onChangePage = useCallback((_, page: number) => setPage(page), []);

  // initialize condition
  useEffect(() => {
    if (filterId && filter) {
      setCondition(filter.attributes.condition);
    }
    else if (tagId && tag) {
      setCondition(`tag:${tag.attributes.name}`);
    }
    else {
      setCondition('');
    }
  }, [tagId, tag, filterId, filter]);

  // initialize page
  useEffect(() => {
    setPage(1);
  }, [condition]);

  // fetch histories
  useEffect(() => {
    let cleanuped = false;

    const fetchData = async () => {
      setLoading(true);
      const { errors, meta } = await dispatch(fetchHistoryList({ condition, page }));
      if (cleanuped) return;
      setLoading(false);
      setErrors(errors);
      if (meta) setTotalPage(meta.page.data.total);
    };
    fetchData();

    return () => { cleanuped = true; };
  }, [condition, page]);

  return (
    <div>
      <ConditionForm condition={condition} onChange={setConditionThrottled} />
      <Pagination count={totalPage} page={page} onChange={onChangePage} />
      {(() => {
        if (loading) return <Indicator/ >;
        if (errors) return <Errors errors={errors} />;
        return <HistoryList histories={histories} />;
      })()}
    </div>
  );
};
