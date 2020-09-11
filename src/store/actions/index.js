import { TABLE_LOADING } from 'store/actions/types';
export * from 'store/actions/listActions';
export * from 'store/actions/portfolioActions';

/* Loading */
export const setTableLoading = payload => ({
  type: TABLE_LOADING,
  payload,
});
