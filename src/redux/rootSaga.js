import { takeEvery, all } from 'redux-saga/effects';
import {
  initStock,
  initStockSuccess,
  initStockFail,
} from 'redux/slice/stockSlice';

import { initPortfolio } from 'redux/slice/portfolioSlice';
import { initPortfolioSaga } from 'redux/saga/portfolioSaga';
// function* initStockSaga({ payload: key }) {
//   try {
//     const localData = yield call([localStorage, 'getItem'], key);
//     if (localData) {
//       yield put(initPortfolio(JSON.parse(localData)));
//     }
//   } catch (error) {
//     yield put({ type: initStockFail.type, payload: error });
//   }
// }

function* rootSaga() {
  yield all(
    // [takeEvery(initStock.type, initStockSaga)],
    [takeEvery(initPortfolio.type, initPortfolioSaga)]
  );
}

export default rootSaga;
