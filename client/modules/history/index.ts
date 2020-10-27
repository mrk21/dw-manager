import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '@/store';
import { History } from '@/api/histories/History';
import * as historyAPI from '@/api/histories';
import { RootState } from '@/modules/root';
import { compare } from '@/libs';

const historyAdapter = createEntityAdapter<History>({
  sortComparer: (a, b) => compare(b.attributes.date, a.attributes.date)
});

export type HistoryState = ReturnType<typeof historyAdapter.getInitialState>;

const initialState = historyAdapter.getInitialState();

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    added: historyAdapter.addOne,
    received(state, { payload }: PayloadAction<History[]>) {
      historyAdapter.setAll(state, payload);
    },
  },
});

// Reducer
export const historyReducer = historySlice.reducer;

// ActionCreators
const historyActions = historySlice.actions;
export const historyAdded = historyActions.added;
export const historyReceived = historyActions.received;

// Selectors
const historySelector = historyAdapter.getSelectors((state: RootState) => state.history);
export const selectAllHistories = historySelector.selectAll;

// Operations
export const fetchHistoryList = ({
  condition = '',
  page = 1,
  per = 20
}: {
  condition?: string;
  page?: number;
  per?: number;
}) => async (dispatch: AppDispatch) => {
  const { data, errors, meta } = await historyAPI.getHistoryList({
    condition,
    page,
    per
  });
  if (data) dispatch(historyReceived(data));
  return { errors, meta };
};
