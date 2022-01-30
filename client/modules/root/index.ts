import { combineReducers } from 'redux';
import { HYDRATE } from "next-redux-wrapper";

import { historySearchReducer } from '@/modules/historySearch';
import { flashReducer } from '@/modules/flash';

export type RootState = ReturnType<typeof combinedReducer>;

const combinedReducer = combineReducers({
  historySearch: historySearchReducer,
  flash: flashReducer,
});

export const rootReducer: typeof combinedReducer = (state, action) => {
  switch (action.type) {
  case HYDRATE:
    return { ...state, ...action.payload };
  default:
    return combinedReducer(state, action);
  }
};
