import { createSlice } from '@reduxjs/toolkit';

const updateLocalStorage = newData => {
  localStorage.removeItem('stocks');
  localStorage.setItem('stocks', JSON.stringify(newData));
};

const stockSlice = createSlice({
  name: 'stock',
  initialState: {},
  reducers: {
    initStock(state, { payload }) {},
    initStockSuccess(state, { payload }) {
      console.log('payload: ', payload);
    },
    initStockFail(state, { payload }) {
      console.log('payload: ', payload);
    },
  },
});

export const {
  initStock,
  initStockSuccess,
  initStockFail,
} = stockSlice.actions;

export default stockSlice;
