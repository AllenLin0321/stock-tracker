import { combineReducers } from 'redux';
import stocksReducer from 'store/reducers/stocks';
import loadingReducer from 'store/reducers/loading';
import portfolioReducer from 'store/reducers/portfolio';

export default combineReducers({
  stocks: stocksReducer,
  loading: loadingReducer,
  portfolio: portfolioReducer,
});
