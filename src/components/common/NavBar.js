import React from 'react';
import { Tabs } from 'antd';
import {
  LineChartOutlined,
  CalculatorOutlined,
  CoffeeOutlined,
} from '@ant-design/icons';
import 'components/common/NavBar.scss';
import { injectIntl } from 'react-intl';
const { TabPane } = Tabs;

class NavBar extends React.Component {
  state = {
    tabs: [
      {
        icon: <LineChartOutlined />,
        key: 'list1',
      },
      // {
      //   title: "觀察名單 2",
      //   icon: <LineChartOutlined />,
      //   key: "list2",
      // },
      {
        icon: <LineChartOutlined />,
        key: 'list2',
      },
      {
        icon: <CalculatorOutlined />,
        key: 'rebalance',
      },
      {
        icon: <SettingOutlined />,
        key: 'setting',
      },
      {
        icon: <MailOutlined />,
        key: 'contact',
      },
      {
        icon: <CoffeeOutlined />,
        key: 'donate',
      },
    ],
  };

  onTabClick = key => {
    this.props.history.push(`/${key}`);
  };

  render() {
    const { intl } = this.props;

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
                tab={
                  <span title={intl.formatMessage({ id: `navBar.${tab.key}` })}>
                    {tab.icon}
                  </span>
                }
                key={tab.key}
              ></TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }
}

export default injectIntl(NavBar);
