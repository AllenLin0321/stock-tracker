import { createSlice } from '@reduxjs/toolkit';

const updateLocalStorage = newData => {
  localStorage.removeItem('portfolio');
  localStorage.setItem('portfolio', JSON.stringify(newData));
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    stocks: [],
    triggerReload: false,
  },
  reducers: {
    initPortfolio(state, { payload }) {},
    initPortfolioSuccess(state, { payload }) {
      state.stocks = payload;
      state.triggerReload = true;
    },
    initPortfolioFail(state, { payload }) {
      console.log('fail: ', payload);
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
      updateLocalStorage(state.stocks);
    },
    onRemovePortfolio(state, { payload }) {
      const newStocks = state.stocks.filter(
        stock => stock.symbol !== payload.symbol
      );
      state.stocks = newStocks;
      updateLocalStorage(state.stocks);
    },
    onChangeStockQuantity(state, { payload }) {
      const stock = state.stocks.find(stock => stock.symbol === payload.symbol);
      if (stock) {
        stock.quantity = payload.quantity;
      }
      updateLocalStorage(state.stocks);
    },

    onChangeOrder(state, { payload }) {
      state.stocks = payload;
      updateLocalStorage(state.stocks);
    },

    onChangeStockPercent(state, { payload }) {
      const stock = state.stocks.find(stock => stock.symbol === payload.symbol);
      if (stock) {
        stock.defaultPrecent = payload.newPercent;
      }
      updateLocalStorage(state.stocks);
    },
    onUpdateTriggerReload(state, { payload }) {
      if (state.triggerReload !== payload) {
        state.triggerReload = payload;
      }
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
  onChangeStockPercent,
  onUpdateTriggerReload,
} = portfolioSlice.actions;

export default portfolioSlice;
