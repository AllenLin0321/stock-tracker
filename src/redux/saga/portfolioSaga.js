import { call, put } from 'redux-saga/effects';
import {
  initPortfolioSuccess,
  initPortfolioFail,
} from 'redux/slice/portfolioSlice';

export function* initPortfolioSaga() {
  try {
    const localData = yield call([localStorage, 'getItem'], 'portfolio');
    if (localData) yield put(initPortfolioSuccess(JSON.parse(localData)));
  } catch (error) {
    yield put({ type: initPortfolioFail.type, payload: error });
  }
}
