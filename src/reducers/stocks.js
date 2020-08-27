/* global chrome */
/* global StorageArea */
import _ from "lodash";
import * as types from "actions/types";
const initialState = { 1: [], 2: [] }; // 觀察名單 1 & 2

function updateLocalStorage(newData) {
  localStorage.removeItem("stocks");
  localStorage.setItem("stocks", JSON.stringify(newData));
  StorageArea.remove("stocks");
  chrome.runtime.sendMessage({
    type: "SAVE_STOCK",
    payload: {
      stocks: {
        1: newData.stocks[1].map(stock => stock.symbol),
        // 2:newData.stocks[2].map(stock=>stock.symbol)
      },
    },
  });
  chrome.runtime.sendMessage({ type: "SHOW_STOCK" });
}

export default (state = initialState, { type, payload }) => {
  let newState;

  switch (type) {
    case types.INITIAL_STOCK:
      return payload;

    case types.SAVE_STOCK:
      newState = {
        ...state,
        [payload.page]: [
          ...state[payload.page].filter(
            stock => stock.symbol !== payload.symbol
          ),
          _.omit(payload, "page"),
        ],
      };
      updateLocalStorage(newState);
      return newState;

    case types.REMOVE_STOCK:
      newState = {
        ...state,
        [payload.page]: state[payload.page].filter(
          stock => stock.symbol !== payload.newStockArr.symbol
        ),
      };
      updateLocalStorage(newState);
      return newState;

    case types.CHANGE_STOCK_ORDER:
      newState = { ...state, [payload.page]: payload.newStockArr };
      updateLocalStorage(newState);
      return newState;
    default:
      return state;
  }
};
