import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Input, message, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

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
    if (symbol === "") return;
    this.setState({ isSearchBtnLoading: true });

    try {
      const { data } = await apiGetStock(symbol);

      if (data.quote) {
        this.props.saveStock(this.getStoreData(data));
        this.setState({ searchVal: "" });
      }
    } catch (error) {
      console.log("error: ", error);
      if (error.response) {
        message.error(error.response.data);
      }
    } finally {
      this.setState({ isSearchBtnLoading: false });
    }
  };

  onClickReload = async () => {
    let promiseArr = [];
    const { stocks, page, saveStock } = this.props;
    if (stocks[page].length === 0) return;
    this.setState({ isReloadLoading: true });

    stocks[page].forEach(stock => {
      promiseArr.push(apiGetStock(stock.symbol));
    });

    Promise.all(promiseArr).then(res => {
      res.forEach(({ data }) => {
        saveStock(this.getStoreData(data));
      });
      this.setState({ isReloadLoading: false });
    });
  };

  getStoreData = data => ({
    ...data.quote,
    updatedTime: moment().format("HH:mm"),
    page: this.props.page,
  });

  render() {
    return (
      <div className="searchBar__wrapper">
        <Input.Search
          allowClear
          type="text"
          placeholder="代碼"
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

export default connect(mapStateToProps, actions)(SearchBar);
