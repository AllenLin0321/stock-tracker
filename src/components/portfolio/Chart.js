import React, { useState } from 'react';
import { Tabs, Tooltip } from 'antd';
import { BarChartOutlined, PieChartOutlined } from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import { numberToCurrency } from 'utils';

const CHART_TYPE = {
  column: 'column',
  pie: 'pie',
};
const { TabPane } = Tabs;

const Chart = ({ data }) => {
  const [chartType, setChartType] = useState(CHART_TYPE.column);

  const columnChartConfig = {
    data,
    xField: 'type',
    yField: 'value',
    seriesField: 'type',
    label: {
      position: 'top',
    },
    legend: false,
    meta: {
      type: { alias: '個股/ETF' },
      value: {
        alias: '價值',
        formatter: val => {
          return `${numberToCurrency({
            num: val.toFixed(2),
            hasSymbol: true,
          })}`;
        },
      },
    },
  };

  const pieChartConfig = {
    appendPadding: 10,
    data: data,
    angleField: 'percent',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: function content(_ref) {
        const { percent, type } = _ref;
        return `${type} \n ${(percent * 100).toFixed(2)}%`;
      },
      autoRotate: false,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    meta: {
      percent: {
        formatter: v => {
          return v.toFixed(2) + '%';
        },
      },
    },
    state: {
      active: {
        style: {
          lineWidth: 0,
          fillOpacity: 0.65,
        },
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };

  return (
    <div id="portoflio__chart">
      <Tabs
        defaultActiveKey={CHART_TYPE.column}
        onTabClick={key => setChartType(key)}
      >
        <TabPane
          tab={
            <Tooltip placement="right" title="長條圖">
              <BarChartOutlined />
              長條圖
            </Tooltip>
          }
          key={CHART_TYPE.column}
        ></TabPane>
        <TabPane
          tab={
            <Tooltip placement="right" title="圓餅圖">
              <PieChartOutlined />
              圓餅圖
            </Tooltip>
          }
          key={CHART_TYPE.pie}
        ></TabPane>
      </Tabs>

      {chartType === CHART_TYPE.column && <Column {...columnChartConfig} />}
      {chartType === CHART_TYPE.pie && <Pie {...pieChartConfig} />}
    </div>
  );
};

export default Chart;
