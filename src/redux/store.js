import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';

// SLICE
import loadingSlice from './slice/loadingSlice';
import stockSlice from './slice/stockSlice';
import portfolioSlice from './slice/portfolioSlice';

let sagaMiddleware = createSagaMiddleware();
const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware];

const createReducer = () => {
  return combineReducers({
    loading: loadingSlice.reducer,
    stock: stockSlice.reducer,
    portfolio: portfolioSlice.reducer,
  });
};

const store = configureStore({
  reducer: createReducer(),
  middleware,
});

sagaMiddleware.run(rootSaga);

export default store;
