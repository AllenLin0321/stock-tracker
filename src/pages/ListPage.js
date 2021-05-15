import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { apiGetStock } from 'api';
import * as actions from 'store/actions';
import { message } from 'antd';
import { formatStockData } from 'utils';

import SearchBar from 'components/common/SearchBar.js';
import Record from 'components/list/Record';

const ListPage = props => {
  useEffect(() => {
    const fetchStocks = async () => {
      await props.getLocalData('stocks');
      if (props.stocks) {
        props.setTableLoading({ tableLoading: true });
        await onClickReload();
        props.setTableLoading({ tableLoading: false });
      }
    };
    fetchStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickSearch = async symbol => {
    if (symbol === '') return;
    let res = { isSuccess: false };

    try {
      const { data } = await apiGetStock(symbol);

      if (data.quote) {
        props.onSaveStock(formatStockData(data));
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
    const { stocks, onSaveStock } = props;
    const delayIncrement = 250;
    let delay = 0;

    if (stocks.length === 0) return;

    let promiseArr = stocks.map(async stock => {
      delay += delayIncrement;
      return new Promise(resolve => setTimeout(resolve, delay)).then(() =>
        apiGetStock(stock.symbol)
      );
    });

    try {
      const res = await Promise.all(promiseArr);
      res.forEach(({ data }) => {
        onSaveStock(formatStockData(data));
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
  return { stocks: state.stocks };
};

export default connect(mapStateToProps, actions)(ListPage);
