import React from 'react';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from 'store/reducers';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';
import zhTW from 'antd/es/locale/zh_TW';
import locale_en from './translations/en.js';
import locale_zhTW from './translations/zh_TW.js';
import rootSaga from 'store/saga';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(rootSaga);

const locale = navigator.language;
const data = {
  'zh-TW': locale_zhTW,
  en: locale_en,
};

export default ({ children }) => {
  return (
    <ConfigProvider locale={zhTW}>
      <Provider store={store}>
        <IntlProvider
          locale={locale}
          messages={data[locale]}
          defaultLocale="en"
        >
          {children}
        </IntlProvider>
      </Provider>
    </ConfigProvider>
  );
};
