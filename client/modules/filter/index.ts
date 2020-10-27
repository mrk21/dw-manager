import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '@/store';
import { Filter, NewFilter } from '@/api/filters/Filter';
import * as filterAPI from '@/api/filters';
import { RootState } from '@/modules/root';

const filterAdapter = createEntityAdapter<Filter>();

export type FilterState = ReturnType<typeof filterAdapter.getInitialState>;

const initialState = filterAdapter.getInitialState();

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    added: filterAdapter.addOne,
    updated: filterAdapter.updateOne,
    received(state, { payload }: PayloadAction<Filter[]>) {
      filterAdapter.setAll(state, payload);
    },
  },
});

// Reducer
export const filterReducer = filterSlice.reducer;

// ActionCreators
const filterActions = filterSlice.actions;
export const filterAdded = filterActions.added;
export const filterUpdated = filterActions.updated;
export const filterReceived = filterActions.received;

// Selectors
const filterSelector = filterAdapter.getSelectors((state: RootState) => state.filter);
export const selectAllFilters = filterSelector.selectAll;
export const selectFilterById = filterSelector.selectById;

// Operations
export const fetchFilter = (id: string) => async (dispatch: AppDispatch) => {
  const { data, errors } = await filterAPI.getFilter(id);
  if (data) dispatch(filterAdded(data));
  return { errors };
};

export const fetchFilterList = ({ page = 1, per = 20 }: { page?: number, per?: number }) => async (dispatch: AppDispatch) => {
  const { data, errors, meta } = await filterAPI.getFilterList({ page, per });
  if (data) dispatch(filterReceived(data));
  return { errors, meta };
};

export const createFilter = (attributes: NewFilter['attributes']) => async (dispatch: AppDispatch) => {
  const { data, errors } = await filterAPI.createFilter({ type: 'filter', attributes });
  if (data) dispatch(filterAdded(data));
  return { errors };
};

export const updateFilter = (filter: Filter) => async (dispatch: AppDispatch) => {
  const { data, errors } = await filterAPI.updateFilter(filter);
  if (data) dispatch(filterUpdated({ id: data.id, changes: data }));
  return { errors };
};
