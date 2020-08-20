import * as types from "actions/types";
const initialState = [];

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.SAVE_STOCK:
      return [
        ...state.filter(stock => stock.symbol !== payload.symbol),
        payload,
      ];

    case types.REMOVE_STOCK:
      return state.filter(stock => stock.symbol !== payload.symbol);

    case types.CHANGE_STOCK_ORDER:
      return [...payload];

    default:
      return state;
  }
};
