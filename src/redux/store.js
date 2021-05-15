import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import loadingSlice from './slice/loadingSlice';
import stockSlice from './slice/stockSlice';
import portfolioSlice from './slice/portfolioSlice';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './saga';

let sagaMiddleware = createSagaMiddleware();
const middleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware];

const store = configureStore({
  reducer: {
    loading: loadingSlice,
    stock: stockSlice,
    portfolio: portfolioSlice,
  },
  middleware,
});

sagaMiddleware.run(rootSaga);

export default store;
