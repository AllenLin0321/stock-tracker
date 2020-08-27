import { combineReducers } from "redux";
import stocksReducer from "reducers/stocks";
import loadingReducer from "reducers/loading";

export default combineReducers({
  stocks: stocksReducer,
  loading: loadingReducer,
});
