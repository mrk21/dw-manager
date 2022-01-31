import { JsonAPIError } from '@/api/JsonAPIError';
import { makeTuple } from '@/libs';
import { getHistoryReport } from '@/api/histories';
import { useQuery } from 'react-query';
import { HistoryReport } from '@/api/histories/HistoryReport';
import { useHasMe } from '../session/useHasMe';

export const useHistoryReport = ({ condition }: {
  condition?: string;
} = {}) => {
  const hasMe = useHasMe();

  const { isLoading, error, data } = useQuery<HistoryReport[] | undefined, JsonAPIError[]>(
    ['history-report', 'condition', condition],
    async () => {
      const { data, errors } = await getHistoryReport({ condition })
      if (errors) throw errors;
      return data;
    },
    {
      enabled: hasMe
    }
  );

  return makeTuple(isLoading, error || undefined, data || []);
};
