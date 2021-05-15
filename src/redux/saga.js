import * as types from 'store/actions/types';
import { call, put, takeEvery, all } from 'redux-saga/effects';

const lOCAL_TYPE = {
  stocks: types.INITIAL_STOCK,
  portfolio: types.INITIAL_PORTFOLIO,
};

function* getLocalStock({ payload: key }) {
  const localData = yield call([localStorage, 'getItem'], key);
  if (localData) {
    yield put({
      type: lOCAL_TYPE[key],
      payload: JSON.parse(localData),
    });
  }
}

function* watchLocalStock() {
  yield takeEvery(types.GET_LOCAL_DATA, getLocalStock);
}

function* rootSaga() {
  yield all([watchLocalStock()]);
}

export default rootSaga;
