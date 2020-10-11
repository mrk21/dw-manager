import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type FlashMessageState = {
  count: number;
  success?: string;
  error?: string;
};

const initialState: FlashMessageState = {
  count: 0,
};

const flashMessageSlice = createSlice({
  name: 'flash_message',
  initialState,
  reducers: {
    flashMessageErrorSet(state, { payload }: PayloadAction<string>) {
      state.count += 1;
      state.error = payload;
      state.success = undefined;
    },
    flashMessageSuccessSet(state, { payload }: PayloadAction<string>) {
      state.count += 1;
      state.success = payload;
      state.error = undefined;
    },
    flashMessageUnset(state) {
      state.count = 0;
      state.success = undefined;
      state.error = undefined;
    },
  },
});

export const flashMessageReducer = flashMessageSlice.reducer;

export const { flashMessageErrorSet, flashMessageSuccessSet, flashMessageUnset } = flashMessageSlice.actions;
