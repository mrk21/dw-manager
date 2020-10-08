import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '@/store';
import { History } from '@/entities/History';
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

export const fetchHistoryList = ({ page = 1, per = 20 }: { page?: number, per?: number }) => async (dispatch: AppDispatch) => {
  const { data, errors, meta } = await historyAPI.getHistoryList({ page, per });
  if (data) dispatch(historyReceived(data));
  return { errors, meta };
};
