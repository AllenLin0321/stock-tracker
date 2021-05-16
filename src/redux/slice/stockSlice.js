import { createSlice } from '@reduxjs/toolkit';

const updateLocalStorage = newData => {
  localStorage.removeItem('stocks');
  localStorage.setItem('stocks', JSON.stringify(newData));
};

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    stocks: [],
  },
  reducers: {
    initStock(state, { payload }) {},
    initStockSuccess(state, { payload }) {
      state.stocks = payload;
    },
    initStockFail(state, { payload }) {
      console.log('payload: ', payload);
    },
    onSaveStock(state, { payload }) {
      let stockIndex = state.stocks.findIndex(
        stock => stock.symbol === payload.symbol
      );
      if (stockIndex !== -1) {
        state.stocks[stockIndex] = payload;
      } else {
        state.stocks.push(payload);
      }
      updateLocalStorage(state.stocks);
    },
    onRemoveStock(state, { payload }) {
      const newStocks = state.stocks.filter(
        stock => stock.symbol !== payload.symbol
      );
      state.stocks = newStocks;
      updateLocalStorage(state.stocks);
    },
    onChangeOrder(state, { payload }) {
      state.stocks = payload;
      updateLocalStorage(state.stocks);
    },
  },
});

export const {
  initStock,
  initStockSuccess,
  initStockFail,
  onSaveStock,
  onRemoveStock,
  onChangeOrder,
} = stockSlice.actions;

export default stockSlice;
