import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createWrapper } from "next-redux-wrapper";
import { RootState, rootReducer } from '@/modules/root';

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunkAction<Return = void> = ThunkAction<
  Promise<Return>,
  RootState,
  unknown,
  Action<string>
>;

export const makeStore = () => (
  configureStore({
    reducer: rootReducer,
    devTools: true,
  })
);

export const wrapper = createWrapper(makeStore);
