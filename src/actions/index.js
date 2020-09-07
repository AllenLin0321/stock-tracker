import * as types from 'actions/types';
export * from 'actions/listActions';
export * from 'actions/portfolioActions';

/* Loading */
export const setTableLoading = payload => ({
  type: types.TABLE_LOADING,
  payload,
});
