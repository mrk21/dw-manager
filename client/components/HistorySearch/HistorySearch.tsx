import { FC, useState, useEffect, useCallback } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { throttle } from '@/libs';
import { Errors } from '@/components/Errors';
import { Indicator } from '@/components/Indicator';
import { ConditionForm } from './ConditionForm';
import { HistoryList } from './HistoryList';
import { useAllHistoryList } from '@/modules/history/useAllHistoryList';
import { useFilter } from '@/modules/filter/useFilter';
import { useTag } from '@/modules/tag/useTag';
import { selectHistorySearchCondition, historySearchConditionSet } from '@/modules/historySearch';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export type HistorySearchProps = {
  tagId?: string;
  filterId?: string;
};

export const HistorySearch: FC<HistorySearchProps> = ({ tagId, filterId }) => {
  const dispatch = useAppDispatch();

  // condition
  const condition = useAppSelector(selectHistorySearchCondition);
  const setCondition = (condition: string) => dispatch(historySearchConditionSet(condition));
  const setConditionThrottled = useCallback(throttle((value: string) => setCondition(value), 1000), []);

  // paginations
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const onChangePage = useCallback((_, page: number) => {
    setPage(page);
  }, []);

  // data
  const [loadingFilter, filterErrors, filter] = useFilter(filterId);
  const [loadingTag, tagErrors, tag] = useTag(tagId);
  const [loadingHistories, historiesErrors, histories, historiesMeta] = useAllHistoryList({ condition, page, per: 30 });

  const loading = loadingFilter || loadingTag || loadingHistories;
  const errors = [...(filterErrors || []), ...(tagErrors || []), ...(historiesErrors || [])];
  const newTotalPage = historiesMeta?.page.data.total;

  // initialize condition
  useEffect(() => {
    if (filterId) {
      if (filter) setCondition(filter.attributes.condition);
    }
    else if (tagId) {
      if (tag) setCondition(`tag:${tag.attributes.name}`);
    }
    else {
      setCondition('');
    }
  }, [tagId, tag, filterId, filter]);

  // initialize page
  useEffect(() => {
    setPage(1);
  }, [condition]);

  // set total page
  useEffect(() => {
    if (newTotalPage) setTotalPage(newTotalPage);
  }, [newTotalPage]);

  return (
    <div>
      <ConditionForm
        disabled={loadingFilter || loadingTag}
        filterId={filterId}
        condition={condition || ''}
        onChange={setConditionThrottled}
      />
      <Pagination disabled={loading} count={totalPage} page={page} onChange={onChangePage} />
      {(() => {
        if (loading) return <Indicator />;
        if (errors.length > 0) return <Errors errors={errors} />;
        return <HistoryList histories={histories} />;
      })()}
    </div>
  );
};
