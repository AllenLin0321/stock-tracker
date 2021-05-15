import React from 'react';

// REDUX
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import store from './redux/store';

// MULTI-LANGUAGE
import { IntlProvider } from 'react-intl';
import zhTW from 'antd/es/locale/zh_TW';
import locale_en from './translations/en.js';
import locale_zhTW from './translations/zh_TW.js';

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
