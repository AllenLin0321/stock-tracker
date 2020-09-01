import { combineReducers } from "redux";
import stocksReducer from "reducers/stocks";
import loadingReducer from "reducers/loading";
import portfolioReducer from "reducers/portfolio";

export default combineReducers({
  stocks: stocksReducer,
  loading: loadingReducer,
  portfolio: portfolioReducer,
});
