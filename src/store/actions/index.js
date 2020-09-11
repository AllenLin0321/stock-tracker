import * as types from 'store/actions/types';
export * from 'store/actions/listActions';
export * from 'store/actions/portfolioActions';

/* Loading */
export const setTableLoading = payload => ({
  type: types.TABLE_LOADING,
  payload,
});
