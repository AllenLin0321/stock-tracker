import { takeEvery, all } from 'redux-saga/effects';

import { initPortfolio } from 'redux/slice/portfolioSlice';
import { initPortfolioSaga } from 'redux/saga/portfolioSaga';

import { initStock } from 'redux/slice/stockSlice';
import { initStockSaga } from 'redux/saga/stockSaga';

function* rootSaga() {
  yield all([
    takeEvery(initStock.type, initStockSaga),
    takeEvery(initPortfolio.type, initPortfolioSaga),
  ]);
}

export default rootSaga;
