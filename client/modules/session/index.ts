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
export const sessionActions = sessionSlice.actions;
const { loggedIn, loggedOut } = sessionActions;

// Selectors
export const sessionSelectors = {
  me: (state: RootState) => state.session.me,
};

// Operations
export const sessionOperations = {
  signIn: (auth: { email: string, password: string }) => async (dispatch: AppDispatch) => {
    const { data, errors } = await sessionAPI.signIn(auth);
    if (data) dispatch(loggedIn(data));
    return { errors };
  },
  signOut: () => async (dispatch: AppDispatch) => {
    await sessionAPI.signOut();
    dispatch(loggedOut());
  },
  getMe: () => async (dispatch: AppDispatch) => {
    const { data, errors } = await sessionAPI.getMe();
    if (data) dispatch(loggedIn(data));
    return { errors };
  },
};
