import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/modules/root';

export type HistorySearchState = {
  condition: string;
};

const initialState: HistorySearchState = {
  condition: ''
};

const historySearchSlice = createSlice({
  name: 'historySearch',
  initialState,
  reducers: {
    conditionSet(state, { payload }: PayloadAction<string>) {
      state.condition = payload;
    },
  },
});

// Reducer
export const historySearchReducer = historySearchSlice.reducer;

// ActionCreators
const historySearchActions = historySearchSlice.actions;
export const historySearchConditionSet = historySearchActions.conditionSet;

// Selectors
const historySearchSelector = (state: RootState) => state.historySearch;
export const selectHistorySearchCondition = createSelector(historySearchSelector, (state) => state.condition);
