/* Stock List */
import * as types from 'store/actions/types';

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
