import * as types from "actions/types";

export const initialStock = payload => ({
  type: types.INITIAL_STOCK,
  payload,
});
export const onSaveStock = payload => ({
  type: types.SAVE_STOCK,
  payload,
});

export const removeStock = payload => ({
  type: types.REMOVE_STOCK,
  payload,
});

export const changeStockOrder = payload => ({
  type: types.CHANGE_STOCK_ORDER,
  payload,
});

export const setTableLoading = payload => ({
  type: types.TABLE_LOADING,
  payload,
});

export const onSavePortfolioStock = payload => ({
  type: types.SAVE_PORTFOLIO_STOCK,
  payload,
});
