import { FC, useState, useEffect, useCallback } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { throttle } from '@/libs';
import { Errors } from '@/components/Errors';
import { Indicator } from '@/components/Indicator';
import { ConditionForm } from './ConditionForm';
import { HistoryList } from './HistoryList';
import { useHistoryList } from '../useHistoryList';
import { useFilter } from '../useFilter';
import { useTag } from '../useTag';

export type HistorySearchProps = {
  tagId?: string;
  filterId?: string;
};

export const HistorySearch: FC<HistorySearchProps> = ({ tagId, filterId }) => {
  // condition
  const [condition, setCondition] = useState<string>();
  const setConditionThrottled = useCallback(throttle((value: string) => setCondition(value), 1000), []);

  // paginations
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const onChangePage = useCallback((_, page: number) => setPage(page), []);

  // data
  const [loadingFilter, filterErrors, filter] = useFilter(filterId);
  const [loadingTag, tagErrors, tag] = useTag(tagId);
  const [loadingHistories, historiesErrors, histories, pageInfo] = useHistoryList({ condition, page });

  const nextTotalPage = pageInfo?.data.total;
  const loading = loadingHistories || loadingFilter || loadingTag;
  const errors = [...(historiesErrors || []), ...(filterErrors || []), ...(tagErrors || [])];

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

  // set total page
  useEffect(() => {
    if (nextTotalPage) setTotalPage(nextTotalPage);
  }, [nextTotalPage]);

  // initialize page
  useEffect(() => {
    setPage(1);
  }, [condition]);

  return (
    <div>
      <ConditionForm filterId={filterId} condition={condition || ''} onChange={setConditionThrottled} />
      <Pagination count={totalPage} page={page} onChange={onChangePage} />
      {(() => {
        if (loading) return <Indicator />;
        if (errors.length > 0) return <Errors errors={errors} />;
        return <HistoryList histories={histories} />;
      })()}
    </div>
  );
};
