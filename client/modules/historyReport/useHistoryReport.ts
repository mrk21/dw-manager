import { JsonAPIError } from '@/api/JsonAPIError';
import { makeTuple } from '@/libs';
import { getHistoryReport } from '@/api/histories';
import { useQuery, UseQueryResult } from 'react-query';
import { HistoryReport } from '@/api/histories/HistoryReport';
import { useMe } from '../session/useMe';

export const useHistoryReport = ({ condition }: {
  condition?: string;
} = {}) => {
  const me = useMe();

  const { isLoading, error, data } = <UseQueryResult<HistoryReport[], JsonAPIError[]>>useQuery(
    ['history-report', 'condition', condition],
    async () => {
      const { data, errors } = await getHistoryReport({ condition })
      if (errors) throw errors;
      return data;
    },
    {
      enabled: !!me.data,
    }
  );

  return makeTuple(isLoading, error || undefined, data || []);
};
