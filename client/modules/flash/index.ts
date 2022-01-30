import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '../../store/index';
import { JsonAPIError } from '../../api/JsonAPIError';

export type FlashState = {
  count: number;
  success?: string;
  error?: string;
};

const initialState: FlashState = {
  count: 0,
};

const flashSlice = createSlice({
  name: 'flash',
  initialState,
  reducers: {
    errorSet(state, { payload }: PayloadAction<string>) {
      state.count += 1;
      state.error = payload;
      state.success = undefined;
    },
    successSet(state, { payload }: PayloadAction<string>) {
      state.count += 1;
      state.success = payload;
      state.error = undefined;
    },
    unset(state) {
      state.count = 0;
      state.success = undefined;
      state.error = undefined;
    },
  },
});

// Reducer
export const flashReducer = flashSlice.reducer;

// ActionCreators
const flashActions = flashSlice.actions;
export const flashErrorSet = flashActions.errorSet;
export const flashSuccessSet = flashActions.successSet;
export const flashUnset = flashActions.unset;

// Utils
export const jsonAPIErrorsToFlash = (dispatch: AppDispatch) => (errors: JsonAPIError[]) => {
  const message = errors.map(e => e.title).join("\n");
  dispatch(flashErrorSet(message));
};
