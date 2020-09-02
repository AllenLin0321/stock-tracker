import React from 'react';
import { Tabs } from 'antd';
import {
  LineChartOutlined,
  PieChartOutlined,
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
        icon: <PieChartOutlined />,
        key: 'portfolio',
      },
      {
        icon: <LineChartOutlined />,
        key: 'list',
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

  render() {
    return (
      <div className="narBar__wrapper">
        <Tabs
          tabPosition="bottom"
          defaultActiveKey="portfolio"
          onChange={this.onTabClick}
        >
          {this.state.tabs.map(tab => {
            return (
              <TabPane
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
              ></TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }
}

export default injectIntl(NavBar);
