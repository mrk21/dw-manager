import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunkAction } from '@/store';
import { History } from '@/entities/History';
import { JsonAPIError } from '@/entities/JsonAPIError';
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
    historyAdded: historyAdapter.addOne,
    historyReceived(state, { payload }: PayloadAction<History[]>) {
      historyAdapter.setAll(state, payload);
    },
  },
});

export const historyReducer = historySlice.reducer;

export const { historyAdded, historyReceived } = historySlice.actions;

export const historySelector = historyAdapter.getSelectors((state: RootState) => state.history);

export const fetchHistoryList = (): AppThunkAction<JsonAPIError[] | undefined> => async (dispatch) => {
  const result = await historyAPI.getHistoryList();
  if (result.data) dispatch(historyReceived(result.data));
  return result.errors;
};
