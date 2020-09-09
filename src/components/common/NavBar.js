import React from 'react';
import { Tabs } from 'antd';
import {
  LineChartOutlined,
  UserOutlined,
  CalculatorOutlined,
  UnorderedListOutlined,
  CoffeeOutlined,
} from '@ant-design/icons';
import { injectIntl } from 'react-intl';

class NavBar extends React.Component {
  state = {
    tabs: [
      {
        icon: <LineChartOutlined />,
        key: 'list',
      },
      {
        icon: <UnorderedListOutlined />,
        key: 'portfolio',
      },
      {
        icon: <UserOutlined />,
        key: 'chart',
      },
      {
        icon: <CalculatorOutlined />,
        key: 'rebalance',
      },
      {
        icon: <CoffeeOutlined />,
        key: 'donate',
      },
    ],
  };

  renderTabPane = () => {
    if (this.state.tabs.length === 0) return;

    const TabPaneJsx = this.state.tabs.map(tab => {
      return (
        <Tabs.TabPane
          tab={
            <span
              title={this.props.intl.formatMessage({
                id: `navBar.${tab.key}`,
              })}
            >
              {tab.icon}
            </span>
          }
          key={tab.key}
        ></Tabs.TabPane>
      );
    });
    return TabPaneJsx;
  };

  render() {
    return (
      <div className="narBar__wrapper">
        <Tabs
          type="card"
          defaultActiveKey="list"
          onChange={key => this.props.history.push(`/${key}`)}
        >
          {this.renderTabPane()}
        </Tabs>
      </div>
    );
  }
}

export default injectIntl(NavBar);
