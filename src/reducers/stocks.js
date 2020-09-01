import * as types from "actions/types";
const initialState = [];

function updateLocalStorage(newData) {
  localStorage.removeItem("stocks");
  localStorage.setItem("stocks", JSON.stringify(newData));
}

export default (state = initialState, { type, payload }) => {
  let newState;

  switch (type) {
    case types.INITIAL_STOCK:
      return payload;

    case types.SAVE_STOCK:
      newState = [
        ...state.filter(stock => stock.symbol !== payload.symbol),
        payload,
      ];

      updateLocalStorage(newState);
      return newState;

    case types.REMOVE_STOCK:
      newState = state.filter(stock => stock.symbol !== payload.symbol);
      updateLocalStorage(newState);
      return newState;

    case types.CHANGE_STOCK_ORDER:
      updateLocalStorage(payload.newStockArr);
      return payload.newStockArr;
    default:
      return state;
  }
};
