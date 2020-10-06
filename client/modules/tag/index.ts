import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, AppThunkAction } from '@/store';
import { Tag } from '@/entities/Tag';
import { JsonAPIError } from '@/entities/JsonAPIError';
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
export const fetchTagList = (): AppThunkAction<JsonAPIError[] | undefined> => async (dispatch) => {
  const result = await tagAPI.getTagList();
  if (result.data) {
    dispatch(tagReceived(result.data));
  }
  return result.errors;
};

const _fetchTag = batchRequest(
  (dispatch: AppDispatch) => async (ids: string[]) => {
    const results = await tagAPI.getTagBatched(ids);
    if (results.data) {
      const tags = compact(Object.values(results.data).map(({ data }) => data));
      if (tags.length > 0) dispatch(tagAddedMany(tags));
    }
    if (results.errors) {
      console.error(results.errors);
    }
    return results.data;
  },
  (id) => id
)({
  wait: 10,
  max: 1000,
});

export const fetchTag = (id: string): AppThunkAction<JsonAPIError[] | undefined> => async (dispatch) => {
  const result = await _fetchTag(dispatch)(id);
  return result.errors;
};
