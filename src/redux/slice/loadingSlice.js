import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    tableLoading: false,
  },
  reducers: {
    setTableLoading: (state, { payload }) => {
      state.tableLoading = payload;
    },
  },
});

export const { setTableLoading } = loadingSlice.actions;

export default loadingSlice;
