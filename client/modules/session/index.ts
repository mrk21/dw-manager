import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch } from '@/store';
import * as sessionAPI from '@/api/sessions';
import { RootState } from '@/modules/root';
import { User } from '@/api/sessions/User';

type SessionState = {
  me?: User;
};

const initialState: SessionState = {};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    loggedIn(state, { payload }: PayloadAction<User>) {
      state.me = payload;
    },
    loggedOut(state) {
      state.me = undefined;
    },
  },
});

// Reducer
export const sessionReducer = sessionSlice.reducer;

// ActionCreators
const sessionActions = sessionSlice.actions;
export const loggedIn = sessionActions.loggedIn;
export const loggedOut = sessionActions.loggedOut;

// Selectors
export const selectMe = (state: RootState) => state.session.me;

// Operations
export const signIn = (auth: { email: string, password: string }) => async (dispatch: AppDispatch) => {
  const { data, errors } = await sessionAPI.signIn(auth);
  if (data) dispatch(loggedIn(data));
  return { errors };
};

export const signOut = () => async (dispatch: AppDispatch) => {
  await sessionAPI.signOut();
  dispatch(loggedOut());
};

export const fetchMe = () => async (dispatch: AppDispatch) => {
  const { data, errors } = await sessionAPI.getMe();
  if (data) dispatch(loggedIn(data));
  return { errors };
};
