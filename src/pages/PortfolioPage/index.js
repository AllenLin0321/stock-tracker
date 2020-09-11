import React from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';

import { apiGetStock } from 'api';
import * as actions from 'store/actions';
import { formatPortfolioData } from 'utils';

import SearchBar from 'components/common/SearchBar';
import Record from 'components/portfolio/Record';

class Portfolio extends React.Component {
  async componentDidMount() {
    const savedPortfolio = localStorage.getItem('portfolio');

    if (savedPortfolio) {
      await this.props.initialPortfolio(JSON.parse(savedPortfolio));
      this.props.setTableLoading({ tableLoading: true });
      await this.onClickReload();
      this.props.setTableLoading({ tableLoading: false });
    }
  }

  onClickSearch = async symbol => {
    if (symbol === '') return;
    let res = { isSuccess: false };

    try {
      const { data } = await apiGetStock(symbol);

      if (data.quote) {
        this.props.onSavePortfolio(formatPortfolioData(data));
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
        let matchStock = portfolio.find(
          stock => stock.symbol === data.quote.symbol
        );

        let quantity = matchStock ? matchStock.quantity : null;
        let defaultPrecent = matchStock ? matchStock.defaultPrecent : null;

        onSavePortfolio(
          formatPortfolioData({ ...data, quantity, defaultPrecent })
        );
      });
    } catch (error) {
      console.log('error: ', error);
    }
  };

  render() {
    return (
      <div>
        <SearchBar
          onClickSearch={this.onClickSearch}
          onClickReload={this.onClickReload}
        />
        <Record />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { portfolio: state.portfolio };
};

export default connect(mapStateToProps, actions)(Portfolio);
