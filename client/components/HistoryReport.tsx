import { FC, useMemo } from 'react';
import { useHistoryReport } from '@/modules/historyReport/useHistoryReport';
import { Indicator } from './Indicator';
import { Errors } from './Errors';
import { selectHistorySearchCondition } from '@/modules/historySearch';
import { useAppSelector } from '@/store/hooks';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export const HistoryReport: FC = () => {
  const condition = useAppSelector(selectHistorySearchCondition);
  const [loading, errors, report] = useHistoryReport({ condition });
  const options = useMemo((): Highcharts.Options => {
    if (!report) return {};
    const data = report.reverse();
    return {
      chart: {
        type: 'line'
      },
      title: {
        text: 'monthly report'
      },
      yAxis: {
        title: {
          text: ''
        },
      },
      xAxis: {
        categories: data.map((r) => r.attributes.period)
      },
      series: [
        {
          type: 'line',
          data: data.map((r) => r.attributes.amount),
          name: 'amount',
          color: '#6666ff',
        },
      ]
    }
  }, [report]);

  return (
    <div>
      <p>Report</p>
      {(() => {
        if (loading) return <Indicator />;
        if (errors) return <Errors errors={errors} />;
        return (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
        );
      })()}
    </div>
  );
};
