import React from 'react';
import { connect } from 'react-redux';
import { apiGetStock } from 'api';
import * as actions from 'actions';
import { message } from 'antd';
import { getStoreData } from 'utils';

import SearchBar from 'components/common/SearchBar';
import Record from 'components/list/Record';

class ListPage extends React.Component {
  async componentDidMount() {
    const savedStock = localStorage.getItem('stocks');
    if (savedStock) {
      await this.props.initialStock(JSON.parse(savedStock));
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
        this.props.onSaveStock(getStoreData(data));
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
    const { stocks, onSaveStock } = this.props;
    const delayIncrement = 200;
    let delay = 0;

    if (stocks.length === 0) return;

    let promiseArr = stocks.map(async stock => {
      delay += delayIncrement;
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiGetStock(stock.symbol);
    });

    try {
      const res = await Promise.all(promiseArr);
      res.forEach(({ data }) => {
        onSaveStock(getStoreData(data));
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
  return { stocks: state.stocks };
};

export default connect(mapStateToProps, actions)(ListPage);
