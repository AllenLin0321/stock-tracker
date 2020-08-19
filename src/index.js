import React from "react";
import ReactDOM from "react-dom";
import { ConfigProvider } from "antd";
import zhTW from "antd/es/locale/zh_TW";

import App from "components/App";
import Root from "Root";

import "antd/dist/antd.css";
import "index.scss";

ReactDOM.render(
  <ConfigProvider locale={zhTW}>
    <Root>
      <App />
    </Root>
  </ConfigProvider>,
  document.getElementById("root")
);
