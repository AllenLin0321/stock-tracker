import React from 'react';
import { connect } from 'react-redux';
import { Empty } from 'antd';
import * as actions from 'store/actions';
import { getStockPercent } from 'utils';

import Chart from 'components/portfolio/Chart';

class Portfolio extends React.Component {
  componentDidMount() {
    this.props.getLocalData('portfolio');
  }

  render() {
    const { portfolio } = this.props;
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
  }
}

const mapStateToProps = state => {
  return { portfolio: state.portfolio };
};

export default connect(mapStateToProps, actions)(Portfolio);