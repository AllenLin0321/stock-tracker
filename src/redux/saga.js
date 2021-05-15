import { initStock, initStockSuccess, initStockFail } from './slice/stockSlice';
import {
  initPortfolio,
  initPortfolioSuccess,
  initPortfolioFail,
} from './slice/portfolioSlice';
import { call, put, takeEvery, all } from 'redux-saga/effects';

function* initStockSaga({ payload: key }) {
  try {
    const localData = yield call([localStorage, 'getItem'], key);
    if (localData) {
      yield put({
        type: initStockSuccess.type,
        payload: JSON.parse(localData),
      });
    }
  } catch (error) {
    yield put({ type: initStockFail.type, payload: error });
  }
}

export function* initPortfolioSaga({ payload: key }) {
  console.log('key: ', key);
  try {
    const localData = yield call([localStorage, 'getItem'], key);
    if (localData) {
      yield put({
        type: initPortfolioSuccess.type,
        payload: JSON.parse(localData),
      });
    }
  } catch (error) {
    yield put({ type: initPortfolioFail.type, payload: error });
  }
}

function* rootSaga() {
  yield all(
    [takeEvery(initStock.type, initStockSaga)],
    [takeEvery(initPortfolio.type, initPortfolioSaga)]
  );
}

export default rootSaga;
