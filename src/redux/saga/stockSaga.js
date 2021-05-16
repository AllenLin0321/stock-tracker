import { call, put } from 'redux-saga/effects';
import { initStockSuccess, initStockFail } from 'redux/slice/stockSlice';

export function* initStockSaga() {
  try {
    const localData = yield call([localStorage, 'getItem'], 'stocks');
    if (localData) yield put(initStockSuccess(JSON.parse(localData)));
  } catch (error) {
    yield put(initStockFail(error));
  }
}
