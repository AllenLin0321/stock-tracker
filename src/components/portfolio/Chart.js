import React, { useState } from 'react';
import { Tabs, Row, Col } from 'antd';
import { BarChartOutlined, PieChartOutlined } from '@ant-design/icons';
import { Donut, Column } from '@ant-design/charts';
import { toCurrency } from 'utils';

const CHART_TYPE = {
  column: 'column',
  donut: 'donut',
};
const { TabPane } = Tabs;

const Chart = ({ data }) => {
  const [chartType, setChartType] = useState(CHART_TYPE.column);
  const commonConfig = {
    data,
    forceFit: true,
    padding: 'auto',
    colorField: 'type',
    meta: {},
  };

  const columnChartConfig = {
    ...commonConfig,
    xField: 'type',
    yField: 'value',
    meta: {
      type: { alias: '個股/ETF' },
      value: {
        formatter: val => {
          return `${toCurrency({
            num: val.toFixed(2),
            hasSymbol: true,
          })}美元`;
        },
      },
    },
    yAxis: {
      title: {
        visible: false,
      },
    },
    interactions: [{ type: 'scrollbar' }],
  };

  const donutChartConfig = {
    ...commonConfig,
    statistic: {
      totalLabel: '總計',
    },
    radius: 0.8,
    angleField: 'percent',
    pieStyle: { stroke: 'white', lineWidth: 5 },
    meta: {
      percent: {
        formatter: val => {
          return `${val.toFixed(2)}%`;
        },
      },
    },
    label: {
      visible: true,
      type: 'outer-center',
    },
  };

  return (
    <>
      <Row>
        <Col span={3}>
          <Tabs
            tabPosition="left"
            defaultActiveKey={CHART_TYPE.column}
            onTabClick={key => setChartType(key)}
          >
            <TabPane
              tab={
                <span>
                  <BarChartOutlined />
                </span>
              }
              key={CHART_TYPE.column}
            ></TabPane>
            <TabPane
              tab={
                <span>
                  <PieChartOutlined />
                </span>
              }
              key={CHART_TYPE.donut}
            ></TabPane>
          </Tabs>
        </Col>
        <Col span={21}>
          {chartType === CHART_TYPE.column && <Column {...columnChartConfig} />}
          {chartType === CHART_TYPE.donut && <Donut {...donutChartConfig} />}
        </Col>
      </Row>
    </>
  );
};

export default Chart;
