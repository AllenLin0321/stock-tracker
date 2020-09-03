import React from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';

import { apiGetStock } from 'api';
import * as actions from 'actions';
import { getPortfolioData, getStockPercent } from 'utils';

import SearchBar from 'components/common/SearchBar';
import Record from 'components/portfolio/Record';
import Chart from 'components/portfolio/Chart';

class Portfolio extends React.Component {
  componentDidMount() {
    const savedPortfolio = localStorage.getItem('portfolio');

    if (savedPortfolio) {
      this.props.initialPortfolio(JSON.parse(savedPortfolio));
    }
  }

  onClickSearch = async symbol => {
    if (symbol === '') return;
    let res = { isSuccess: false };

    try {
      const { data } = await apiGetStock(symbol);

      if (data.quote) {
        this.props.onSavePortfolio(getPortfolioData(data));
      }
      res.isSuccess = true;
    } catch (error) {
      console.log('error: ', error);
      if (error.response) {
        message.error(error.response.data);
      }
    } finally {
      return res;
    }
  };

  onClickReload = async () => {
    const { portfolio, onSavePortfolio } = this.props;
    const delayIncrement = 200;
    let delay = 0;

    if (portfolio.length === 0) return;

    let promiseArr = portfolio.map(async stock => {
      delay += delayIncrement;
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiGetStock(stock.symbol);
    });

    try {
      const res = await Promise.all(promiseArr);
      res.forEach(({ data }) => {
        onSavePortfolio(getPortfolioData(data));
      });
    } catch (error) {
      console.log('error: ', error);
    }
  };

  render() {
    const chartData = this.props.portfolio.map(stock => ({
      type: stock.symbol,
      value: getStockPercent({ stock, stockArr: this.props.portfolio }),
    }));

    return (
      <div>
        <SearchBar
          onClickSearch={this.onClickSearch}
          onClickReload={this.onClickReload}
        />
        <Record />
        {this.props.portfolio.length !== 0 && <Chart data={chartData} />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { portfolio: state.portfolio };
};

export default connect(mapStateToProps, actions)(Portfolio);
