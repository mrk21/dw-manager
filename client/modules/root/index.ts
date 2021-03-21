import { combineReducers } from 'redux';
import { HYDRATE } from "next-redux-wrapper";

import { historyReducer } from '@/modules/history';
import { historyReportReducer } from '@/modules/historyReport';
import { historySearchReducer } from '@/modules/historySearch';
import { tagReducer } from '@/modules/tag';
import { filterReducer } from '@/modules/filter';
import { flashReducer } from '@/modules/flash';
import { sessionReducer } from '@/modules/session';

export type RootState = ReturnType<typeof combinedReducer>;

const combinedReducer = combineReducers({
  history: historyReducer,
  historyReport: historyReportReducer,
  historySearch: historySearchReducer,
  tag: tagReducer,
  filter: filterReducer,
  flash: flashReducer,
  session: sessionReducer,
});

export const rootReducer: typeof combinedReducer = (state, action) => {
  switch (action.type) {
  case HYDRATE:
    return { ...state, ...action.payload };
  default:
    return combinedReducer(state, action);
  }
};
