import React from 'react';
import { Tabs, Tooltip } from 'antd';
import {
  LineChartOutlined,
  UserOutlined,
  CalculatorOutlined,
  UnorderedListOutlined,
  CoffeeOutlined,
} from '@ant-design/icons';
import { injectIntl } from 'react-intl';

const tabs = [
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
];

const renderTabPane = props => {
  const TabPaneJsx = tabs.map(tab => {
    return (
      <Tabs.TabPane
        tab={
          <Tooltip
            placement="bottom"
            title={props.intl.formatMessage({
              id: `navBar.${tab.key}`,
            })}
          >
            {tab.icon}
          </Tooltip>
        }
        key={tab.key}
      ></Tabs.TabPane>
    );
  });
  return TabPaneJsx;
};

const NavBar = props => {
  const tabsConfig = {
    type: 'card',
    defaultActiveKey: 'list',
    size: 'large',
    tabBarGutter: 2,
    onChange: key => props.history.push(`/${key}`),
  };

  return (
    <div className="narBar__wrapper">
      <Tabs {...tabsConfig}>{renderTabPane(props)}</Tabs>
    </div>
  );
};

export default injectIntl(NavBar);
