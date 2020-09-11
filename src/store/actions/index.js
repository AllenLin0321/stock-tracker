import { TABLE_LOADING, GET_LOCAL_DATA } from 'store/actions/types';
export * from 'store/actions/listActions';
export * from 'store/actions/portfolioActions';

/* Loading */
export const setTableLoading = payload => ({
  type: TABLE_LOADING,
  payload,
});

export const getLocalData = key => ({
  type: GET_LOCAL_DATA,
  payload: key,
});
