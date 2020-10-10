import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type FlashMessageState = {
  success?: string;
  error?: string;
};

const initialState: FlashMessageState = {};

const flashMessageSlice = createSlice({
  name: 'flash_message',
  initialState,
  reducers: {
    errorSet(state, { payload }: PayloadAction<string>) {
      state.error = payload;
    },
    errorUnset(state) {
      state.error = undefined;
    },
    successSet(state, { payload }: PayloadAction<string>) {
      state.success = payload;
    },
    successUnset(state) {
      state.success = undefined;
    },
  },
});

export const flashMessageReducer = flashMessageSlice.reducer;

export const { errorSet, errorUnset, successSet, successUnset } = flashMessageSlice.actions;
