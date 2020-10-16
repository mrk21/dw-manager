import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '@/store';
import { Filter, NewFilter } from '@/entities/Filter';
import * as filterAPI from '@/api/filters';
import { RootState } from '@/modules/root';

const filterAdapter = createEntityAdapter<Filter>();

export type FilterState = ReturnType<typeof filterAdapter.getInitialState>;

const initialState = filterAdapter.getInitialState();

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    filterAdded: filterAdapter.addOne,
    filterUpdated: filterAdapter.updateOne,
    filterReceived(state, { payload }: PayloadAction<Filter[]>) {
      filterAdapter.setAll(state, payload);
    },
  },
});

export const filterReducer = filterSlice.reducer;

export const { filterAdded, filterUpdated, filterReceived } = filterSlice.actions;

export const filterSelector = filterAdapter.getSelectors((state: RootState) => state.filter);

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
