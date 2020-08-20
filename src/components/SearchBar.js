import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Input, message, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import * as actions from "actions";
import { apiGetStock } from "api";
import "components/SearchBar.scss";

export class SearchBar extends Component {
  state = { searchVal: null };

  onInputChange = event => {
    this.setState({ searchVal: event.target.value.toUpperCase() });
  };

  onClickSearch = async symbol => {
    if (symbol === "") return;
    try {
      const { data } = await apiGetStock(symbol);

      if (data.quote) {
        this.props.saveStock({
          ...data.quote,
          updatedTime: moment().format("HH:mm"),
        });
        this.setState({ searchVal: "" });
      }
    } catch (error) {
      console.log("error: ", error);
      if (error.response) {
        message.error(error.response.data);
      }
    }
  };

  onClickReload = async () => {
    this.props.stocks.map(async stock => {
      await this.onClickSearch(stock.symbol);
    });
  };

  render() {
    return (
      <div className="searchBar__wrapper">
        <Input.Search
          allowClear
          type="text"
          placeholder="代碼"
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
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { stocks: state.stocks };
};

export default connect(mapStateToProps, actions)(SearchBar);
