import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Input, message, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { injectIntl } from 'react-intl';
import * as actions from 'actions';
import { apiGetStock } from 'api';
import 'components/list/SearchBar.scss';

import * as actions from "actions";
import { apiGetStock } from "api";
import "components/list/SearchBar.scss";
export class SearchBar extends Component {
  state = {
    searchVal: null,
    isSearchBtnLoading: false,
    isReloadLoading: false,
  };

  onInputChange = event => {
    this.setState({ searchVal: event.target.value.toUpperCase() });
  };

  onClickSearch = async symbol => {
    if (symbol === '') return;
    this.setState({ isSearchBtnLoading: true });

    try {
      const { data } = await apiGetStock(symbol);

      if (data.quote) {
        this.props.onSaveStock(this.getStoreData(data));
        this.setState({ searchVal: "" });
      }
    } catch (error) {
      console.log('error: ', error);
      if (error.response) {
        message.error(error.response.data);
      }
    } finally {
      this.setState({ isSearchBtnLoading: false });
    }
  };

  onClickReload = async () => {
    const { stocks, page, onSaveStock } = this.props;
    const delayIncrement = 200;
    let delay = 0;

    if (stocks[page].length === 0) return;
    this.setState({ isReloadLoading: true });

    let promiseArr = stocks[page].map(async stock => {
      delay += delayIncrement;

      await new Promise(resolve => setTimeout(resolve, delay));
      return apiGetStock(stock.symbol);
    });

    try {
      const res = await Promise.all(promiseArr);
      res.forEach(({ data }) => {
        onSaveStock(this.getStoreData(data));
      });
    } catch (error) {
      console.log("error: ", error);
    } finally {
      this.setState({ isReloadLoading: false });
    }
  };

  getStoreData = data => ({
    ...data.quote,
    updatedTime: moment().format('HH:mm'),
    page: this.props.page,
  });

  render() {
    const { intl } = this.props;
    return (
      <div className="searchBar__wrapper">
        <Input.Search
          allowClear
          type="text"
          placeholder={intl.formatMessage({ id: 'searchBar.placeholder' })}
          loading={this.state.isSearchBtnLoading}
          enterButton
          size="large"
          value={this.state.searchVal}
          onSearch={this.onClickSearch}
          onChange={this.onInputChange}
        />
        <Button
          className="searchBar__reload-btn"
          type="primary"
          icon={<ReloadOutlined />}
          size="large"
          onClick={this.onClickReload}
          loading={this.state.isReloadLoading}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { stocks: state.stocks };
};

export default connect(mapStateToProps, actions)(injectIntl(SearchBar));
