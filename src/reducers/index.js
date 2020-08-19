import { combineReducers } from "redux";
import stocksReducer from "reducers/stocks";

export default combineReducers({ stocks: stocksReducer });
