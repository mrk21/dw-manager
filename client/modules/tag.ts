import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, AppThunkAction } from '@/store';
import { Tag } from '@/entities/Tag';
import { APIError } from '@/entities/APIError';
import * as tagAPI from '@/api/tags';
import { RootState } from './root';
import { batchRequest } from '@/libs/batchRequest'

const tagAdapter = createEntityAdapter<Tag>();

export type TagState = ReturnType<typeof tagAdapter.getInitialState>;

const initialState = tagAdapter.getInitialState();

const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    tagAdded: tagAdapter.addOne,
    tagReceived(state, { payload }: PayloadAction<Tag[]>) {
      tagAdapter.setAll(state, payload);
    },
  },
});

export const tagReducer = tagSlice.reducer;

export const { tagAdded, tagReceived } = tagSlice.actions;

export const tagSelector = tagAdapter.getSelectors((state: RootState) => state.tag);

const fetchTagBatched = batchRequest(
  (dispatch: AppDispatch) => async (ids: string[]) => {
    const results = await tagAPI.getTagBatched(ids);
    for (const result of Object.values(results)) {
      if (result.data) {
        dispatch(tagAdded(result.data));
      }
    }
    return results;
  },
  (id) => id
)({
  interval: 20,
  max: 100,
});

export const fetchTag = (id: string): AppThunkAction<APIError[] | undefined> => async (dispatch) => {
  const result = await fetchTagBatched(dispatch)(id);
  return result.errors;
};
