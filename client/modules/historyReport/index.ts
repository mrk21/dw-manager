import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '@/store';
import { HistoryReport } from '@/api/histories/HistoryReport';
import * as historyAPI from '@/api/histories';
import { RootState } from '@/modules/root';
import { compare } from '@/libs';

const historyReportAdapter = createEntityAdapter<HistoryReport>({
  sortComparer: (a, b) => compare(b.attributes.period, a.attributes.period)
});

export type HistoryReportState = ReturnType<typeof historyReportAdapter.getInitialState>;

const initialState = historyReportAdapter.getInitialState();

const historyReportSlice = createSlice({
  name: 'historyReport',
  initialState,
  reducers: {
    added: historyReportAdapter.addOne,
    received(state, { payload }: PayloadAction<HistoryReport[]>) {
      historyReportAdapter.setAll(state, payload);
    },
  },
});

// Reducer
export const historyReportReducer = historyReportSlice.reducer;

// ActionCreators
const historyReportActions = historyReportSlice.actions;
export const historyReportAdded = historyReportActions.added;
export const historyReportReceived = historyReportActions.received;

// Selectors
const historyReportSelector = historyReportAdapter.getSelectors((state: RootState) => state.historyReport);
export const selectHistoryReport = historyReportSelector.selectAll;

// Operations
export const fetchHistoryReport = ({
  condition = '',
}: {
  condition?: string;
}) => async (dispatch: AppDispatch) => {
  const { data, errors, meta } = await historyAPI.getHistoryReport({
    condition,
  });
  if (data) dispatch(historyReportReceived(data));
  return { errors, meta };
};
