import React from "react";
import { Tabs, Space } from "antd";
import {
  SettingOutlined,
  LineChartOutlined,
  MailOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;

class NavBar extends React.Component {
  state = {
    tabs: [
      {
        title: "觀察名單 1",
        icon: <LineChartOutlined />,
      },
      {
        title: "觀察名單 2",
        icon: <LineChartOutlined />,
      },
      {
        title: "設定",
        icon: <SettingOutlined />,
      },
      {
        title: "聯絡",
        icon: <MailOutlined />,
      },
      {
        title: "贊助",
        icon: <CoffeeOutlined />,
      },
    ],
  };

  render() {
    return (
      <div>
        <Space style={{ marginBottom: 16 }}></Space>
        <Tabs tabPosition="bottom">
          {this.state.tabs.map((tab, index) => {
            return (
              <TabPane
                tab={
                  <span>
                    {tab.icon}
                    {tab.title}
                  </span>
                }
                key={index}
              ></TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }
}

export default NavBar;
