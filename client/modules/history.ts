import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunkAction } from '@/store';
import { History } from '@/entities/History';
import { APIError } from '@/entities/APIError';
import * as historyAPI from '@/api/histories';
import { RootState } from './root';

const compare = <T>(a: T, b: T) => (
  a == b ? 0 : a > b ? -1 : 1
);

const historyAdapter = createEntityAdapter<History>({
  sortComparer: (a, b) => compare(a.attributes.date, b.attributes.date)
});

export type HistoryState = ReturnType<typeof historyAdapter.getInitialState>;

const initialState = historyAdapter.getInitialState();

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    historyAdded: historyAdapter.addOne,
    historyReceived(state, { payload }: PayloadAction<History[]>) {
      historyAdapter.setAll(state, payload);
    },
  },
});

export const historyReducer = historySlice.reducer;

export const { historyAdded, historyReceived } = historySlice.actions;

export const historySelector = historyAdapter.getSelectors((state: RootState) => state.history);

export const fetchHistoryList = (): AppThunkAction<APIError[] | undefined> => async (dispatch) => {
  const result = await historyAPI.getHistoryList();
  if (result.data) dispatch(historyReceived(result.data));
  return result.errors;
};
