import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from "next-redux-wrapper";
import { rootReducer } from '@/modules/root';

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];

export const makeStore = () => (
  configureStore({
    reducer: rootReducer,
    devTools: true,
  })
);

export const wrapper = createWrapper(makeStore);
