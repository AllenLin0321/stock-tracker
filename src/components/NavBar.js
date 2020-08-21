import React from "react";
import { Tabs } from "antd";
import {
  SettingOutlined,
  LineChartOutlined,
  CalculatorOutlined,
  MailOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import "components/NavBar.scss";

const { TabPane } = Tabs;

class NavBar extends React.Component {
  state = {
    tabs: [
      {
        title: "觀察名單 1",
        icon: <LineChartOutlined />,
        key: "list1",
      },
      {
        title: "觀察名單 2",
        icon: <LineChartOutlined />,
        key: "list2",
      },
      {
        title: "再平衡",
        icon: <CalculatorOutlined />,
        key: "rebalance",
      },
      {
        title: "設定",
        icon: <SettingOutlined />,
        key: "setting",
      },
      {
        title: "聯絡",
        icon: <MailOutlined />,
        key: "contact",
      },
      {
        title: "贊助",
        icon: <CoffeeOutlined />,
        key: "donate",
      },
    ],
  };

  onTabClick = key => {
    this.props.history.push(`/${key}`);
  };

  render() {
    return (
      <div className="narBar__wrapper">
        <Tabs
          tabPosition="bottom"
          defaultActiveKey="list1"
          onChange={this.onTabClick}
        >
          {this.state.tabs.map(tab => {
            return (
              <TabPane
                tab={<span title={tab.title}>{tab.icon}</span>}
                key={tab.key}
              ></TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }
}

export default NavBar;
