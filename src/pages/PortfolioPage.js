import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';

import { apiGetStock } from 'api';
import * as actions from 'store/actions';
import { formatPortfolioData } from 'utils';

import SearchBar from 'components/common/SearchBar.js';
import Record from 'components/portfolio/Record';

const Portfolio = props => {
  useEffect(() => {
    const fetchPortfolio = async () => {
      await props.getLocalData('portfolio');
      if (props.portfolio) {
        props.setTableLoading({ tableLoading: true });
        await onClickReload();
        props.setTableLoading({ tableLoading: false });
      }
    };
    fetchPortfolio();
  }, []);

  const onClickSearch = async symbol => {
    if (symbol === '') return;
    let res = { isSuccess: false };

    try {
      const { data } = await apiGetStock(symbol);

      if (data.quote) {
        props.onSavePortfolio(formatPortfolioData(data));
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

  const onClickReload = async () => {
    const { portfolio, onSavePortfolio } = props;
    const delayIncrement = 200;
    let delay = 0;

    if (portfolio.length === 0) return;

    let promiseArr = portfolio.map(async stock => {
      delay += delayIncrement;
      return new Promise(resolve => setTimeout(resolve, delay)).then(() =>
        apiGetStock(stock.symbol)
      );
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

  return (
    <div>
      <SearchBar
        onClickSearch={onClickSearch}
        onClickReload={onClickReload}
        setTableLoading={props.setTableLoading}
      />
      <Record />
    </div>
  );
};

const mapStateToProps = state => {
  return { portfolio: state.portfolio };
};

export default connect(mapStateToProps, actions)(Portfolio);
