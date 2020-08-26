import {
  SAVE_STOCK,
  CHANGE_STOCK_ORDER,
  REMOVE_STOCK,
  INITIAL_STOCK,
} from "actions/types";

export const initialStock = payload => ({
  type: INITIAL_STOCK,
  payload,
});
export const saveStock = payload => ({
  type: SAVE_STOCK,
  payload,
});

export const removeStock = payload => ({
  type: REMOVE_STOCK,
  payload,
});

export const changeStockOrder = payload => ({
  type: CHANGE_STOCK_ORDER,
  payload,
});
