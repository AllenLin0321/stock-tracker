import React from 'react';
import { connect } from 'react-redux';

import * as actions from 'actions';
import { getStockPercent } from 'utils';

import Chart from 'components/portfolio/Chart';

class Portfolio extends React.Component {
  componentDidMount() {
    const savedPortfolio = localStorage.getItem('portfolio');

    if (savedPortfolio) {
      this.props.initialPortfolio(JSON.parse(savedPortfolio));
    }
  }

  render() {
    const chartData = this.props.portfolio.map(stock => ({
      type: stock.symbol,
      percent: getStockPercent({ stock, stockArr: this.props.portfolio }),
      value: stock.latestPrice * stock.quantity,
    }));

    return (
      <div>
        {this.props.portfolio.length !== 0 && <Chart data={chartData} />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { portfolio: state.portfolio };
};

export default connect(mapStateToProps, actions)(Portfolio);
