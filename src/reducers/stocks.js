import _ from "lodash";
import * as types from "actions/types";
const initialState = { 1: [], 2: [] };

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.SAVE_STOCK:
      return {
        ...state,
        [payload.page]: [
          ...state[payload.page].filter(
            stock => stock.symbol !== payload.symbol
          ),
          _.omit(payload, "page"),
        ],
      };

    case types.REMOVE_STOCK:
      return {
        ...state,
        [payload.page]: state[payload.page].filter(
          stock => stock.symbol !== payload.newStockArr.symbol
        ),
      };

    case types.CHANGE_STOCK_ORDER:
      return { ...state, [payload.page]: payload.newStockArr };

    default:
      return state;
  }
};
