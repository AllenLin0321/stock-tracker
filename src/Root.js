import React from "react";
import { Provider } from "react-redux";
import { createStore, compose } from "redux";
import reducers from "reducers/index";
import { IntlProvider } from "react-intl";
import { ConfigProvider } from "antd";
import zhTW from "antd/es/locale/zh_TW";
import locale_en from "./translations/en.js";
import locale_zhTW from "./translations/zh_TW.js";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const locale = navigator.language;
const data = {
  "zh-TW": locale_zhTW,
  en: locale_en,
};

export default ({ initialState = {}, children }) => {
  return (
    <ConfigProvider locale={zhTW}>
      <Provider store={createStore(reducers, initialState, composeEnhancers())}>
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
