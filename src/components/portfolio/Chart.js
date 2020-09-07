import React from 'react';
import { Donut } from '@ant-design/charts';

const Chart = ({ data }) => {
  return (
    <Donut
      data={data || []}
      forceFit
      statistic={{
        totalLabel: '總計',
      }}
      meta={{
        value: {
          formatter: val => {
            return `${val.toFixed(2)}%`;
          },
        },
      }}
      radius={0.8}
      padding="auto"
      angleField="value"
      colorField="type"
      pieStyle={{ stroke: 'white', lineWidth: 5 }}
    />
  );
};

export default Chart;
