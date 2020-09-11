/* Portfolio */
import * as types from 'store/actions/types';

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

export const changeDefaultPercent = ({ rowData, newPercent }) => ({
  type: types.CHANGE_DEFAULT_PERCENT,
  payload: {
    ...rowData,
    defaultPrecent: newPercent,
  },
});
