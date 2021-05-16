import React from 'react';
import { useSelector } from 'react-redux';
import { Empty } from 'antd';
import { getStockPercent } from 'utils';

import Chart from 'components/portfolio/Chart';

const ChartPage = () => {
  const portfolio = useSelector(state => state.portfolio.stocks);

  const chartData = portfolio.map(stock => ({
    type: stock.symbol,
    percent: getStockPercent({ stock, stockArr: portfolio }),
    value: stock.latestPrice * stock.quantity,
  }));

  if (!portfolio || portfolio.length === 0) {
    return <Empty />;
  }

  return (
    <div>
      <Chart data={chartData} />
    </div>
  );
};

export default ChartPage;
