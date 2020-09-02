import * as types from 'actions/types';

/* Stock List */

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

/* Loading */

export const setTableLoading = payload => ({
  type: types.TABLE_LOADING,
  payload,
});

/* Portfolio */

export const initialPortfolio = payload => ({
  type: types.INITIAL_PORTFOLIO,
  payload,
});

export const onSavePortfolio = payload => ({
  type: types.SAVE_PORTFOLIO,
  payload,
});

export const removePortfolio = payload => ({
  type: types.REMOVE_PORTFOLIO,
  payload,
});

export const changePortfolioOrder = payload => ({
  type: types.CHANGE_PORTFOLIO_ORDER,
  payload,
});

export const changeStockQuantity = payload => ({
  type: types.CHANGE_STOCK_QUANTITY,
  payload,
});
