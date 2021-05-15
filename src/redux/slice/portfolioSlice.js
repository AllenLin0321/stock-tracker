import { createSlice } from '@reduxjs/toolkit';

const updateLocalStorage = newData => {
  localStorage.removeItem('portfolio');
  localStorage.setItem('portfolio', JSON.stringify(newData));
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    stocks: [],
  },
  reducers: {
    initPortfolio(state, { payload }) {
      console.log('payload: ', payload);
    },
    initPortfolioSuccess(state, { payload }) {
      console.log('payload: ', payload);
    },
    initPortfolioFail(state, { payload }) {
      console.log('payload: ', payload);
    },
    onSavePortfolio(state, { payload }) {
      let stockIndex = state.stocks.findIndex(
        stock => stock.symbol === payload.symbol
      );
      if (stockIndex !== -1) {
        state.stocks[stockIndex] = payload;
      } else {
        state.stocks.push(payload);
      }
    },
    onChangeStockQuantity(state, { payload }) {
      const stock = state.stocks.find(stock => stock.symbol === payload.symbol);
      if (stock) {
        stock.quantity = payload.quantity;
      }
    },

    onRemovePortfolio(state, { payload }) {
      const newStocks = state.stocks.filter(
        stock => stock.symbol !== payload.symbol
      );
      state.stocks = newStocks;
    },

    onChangeOrder(state, { payload }) {
      state.stocks = payload;
    },
  },
});

export const {
  initPortfolio,
  initPortfolioSuccess,
  initPortfolioFail,
  onSavePortfolio,
  onChangeStockQuantity,
  onRemovePortfolio,
  onChangeOrder,
} = portfolioSlice.actions;

export default portfolioSlice;
