import React from 'react';
import { Donut, Column } from '@ant-design/charts';
import { toCurrency } from 'utils';

const Chart = ({ data }) => {
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
    label: {
      visible: true,
    },
    meta: {
      type: { alias: '個股/ETF' },
      value: {
        alias: '股價價值(美元)',
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
  };

  return (
    <>
      <Column {...columnChartConfig} />
      <Donut {...donutChartConfig} />
    </>
  );
};

export default Chart;
