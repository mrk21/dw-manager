import { combineReducers } from 'redux';
import { HYDRATE } from "next-redux-wrapper";
import { historyReducer } from '@/modules/history';
import { tagReducer } from '@/modules/tag';

export type RootState = ReturnType<typeof combinedReducer>;

const combinedReducer = combineReducers({
  history: historyReducer,
  tag: tagReducer,
});

export const rootReducer: typeof combinedReducer = (state, action) => {
  switch (action.type) {
  case HYDRATE:
    return { ...state, ...action.payload };
  default:
    return combinedReducer(state, action);
  }
};
