import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '@/store';
import { Tag } from '@/entities/Tag';
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
    tagAdded: tagAdapter.addOne,
    tagAddedMany: tagAdapter.addMany,
    tagReceived(state, { payload }: PayloadAction<Tag[]>) {
      tagAdapter.setAll(state, payload);
    },
  },
});

// Reducer
export const tagReducer = tagSlice.reducer;

// ActionCreators
export const { tagAdded, tagAddedMany, tagReceived } = tagSlice.actions;

// Selectors
const tagSelector = tagAdapter.getSelectors((state: RootState) => state.tag);
export const selectTagById = tagSelector.selectById;

// Operations
export const fetchTagList = () => async (dispatch: AppDispatch) => {
  const { data, errors } = await tagAPI.getTagList();
  if (data) {
    dispatch(tagReceived(data));
  }
  return errors;
};

const _fetchTag = batchRequest(
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
  const { errors } = await _fetchTag(dispatch)(id);
  return errors;
};
