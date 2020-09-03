import React from 'react';
import { Tabs } from 'antd';
import {
  LineChartOutlined,
  PieChartOutlined,
  CalculatorOutlined,
  CoffeeOutlined,
} from '@ant-design/icons';
import { injectIntl } from 'react-intl';
const { TabPane } = Tabs;

class NavBar extends React.Component {
  state = {
    tabs: [
      {
        icon: <LineChartOutlined />,
        key: 'list',
      },
      {
        icon: <PieChartOutlined />,
        key: 'portfolio',
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

  onTabClick = key => {
    this.props.history.push(`/${key}`);
  };

  renderTabPane = () => {
    if (this.state.tabs.length === 0) return;
    const TabPaneJsx = this.state.tabs.map(tab => {
      return (
        <TabPane
          tab={
            <span>
              {tab.icon}{' '}
              {this.props.intl.formatMessage({
                id: `navBar.${tab.key}`,
              })}
            </span>
          }
          key={tab.key}
        ></TabPane>
      );
    });
    return TabPaneJsx;
  };

  render() {
    return (
      <div className="narBar__wrapper">
        <Tabs type="card" defaultActiveKey="list" onChange={this.onTabClick}>
          {this.renderTabPane()}
        </Tabs>
      </div>
    );
  }
}

export default injectIntl(NavBar);
