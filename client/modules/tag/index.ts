import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '@/store';
import { Tag } from '@/api/tags/Tag';
import * as tagAPI from '@/api/tags';
import { RootState } from '@/modules/root';
import { batchRequest } from '@/libs/batchRequest';
import { compact } from '@/libs';

const tagAdapter = createEntityAdapter<Tag>();

export type TagState = ReturnType<typeof tagAdapter.getInitialState>;

const initialState = tagAdapter.getInitialState();
const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    added: tagAdapter.addOne,
    addedMany: tagAdapter.addMany,
    received(state, { payload }: PayloadAction<Tag[]>) {
      tagAdapter.setAll(state, payload);
    },
  },
});

// Reducer
export const tagReducer = tagSlice.reducer;

// ActionCreators
const tagActions = tagSlice.actions;
export const tagAdded = tagActions.added;
export const tagAddedMany = tagActions.addedMany;
export const tagReceived = tagActions.received;

// Selectors
const tagSelector = tagAdapter.getSelectors((state: RootState) => state.tag);
export const selectTags = tagSelector.selectAll;
export const selectTagById = tagSelector.selectById;

// Operations
export const fetchTagList = ({ page = 1, per = 20 }: { page?: number, per?: number }) => async (dispatch: AppDispatch) => {
  const { data, errors, meta } = await tagAPI.getTagList({ page, per });
  if (data) dispatch(tagReceived(data));
  return { errors, meta };
};

const fetchTagBatched = batchRequest(
  (dispatch: AppDispatch) => async (ids: string[]) => {
    const { data, errors } = await tagAPI.getTagBatched(ids);
    if (data) {
      const tags = compact(Object.values(data).map(({ data }) => data));
      if (tags.length > 0) dispatch(tagAddedMany(tags));
    }
    if (errors) {
      console.error(errors);
    }
    return data;
  },
  (id) => id
)({
  wait: 10,
  max: 1000,
});
export const fetchTag = (id: string) => async (dispatch: AppDispatch) => {
  const { errors } = await fetchTagBatched(dispatch)(id);
  return errors;
};
