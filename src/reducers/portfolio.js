import * as types from 'actions/types';
const initialState = [];

function updateLocalStorage(newData) {
  localStorage.removeItem('portfolio');
  localStorage.setItem('portfolio', JSON.stringify(newData));
}

export default (state = initialState, { type, payload }) => {
  let newState;

  switch (type) {
    case types.INITIAL_PORTFOLIO:
      return payload;

    case types.SAVE_PORTFOLIO:
      newState = [
        ...state.filter(stock => stock.symbol !== payload.symbol),
        payload,
      ];

      updateLocalStorage(newState);
      return newState;

    case types.REMOVE_PORTFOLIO:
      newState = state.filter(stock => stock.symbol !== payload.symbol);
      updateLocalStorage(newState);
      return newState;

    case types.CHANGE_PORTFOLIO_ORDER:
      updateLocalStorage(payload.newStockArr);
      return payload.newStockArr;

    case types.CHANGE_STOCK_QUANTITY:
      newState = state.map(stock => {
        return stock.symbol === payload.symbol ? payload : stock;
      });
      updateLocalStorage(newState);
      return newState;

    default:
      return state;
  }
};
