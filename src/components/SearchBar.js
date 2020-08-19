import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "actions";
import { Input, message } from "antd";
import { apiGetStock } from "../api";

export class SearchBar extends Component {
  state = { searchVal: null, latestPrice: null };

  onInputChange = event => {
    this.setState({ searchVal: event.target.value.toUpperCase() });
  };

  onClickSearch = async symbol => {
    if (symbol === "") return;
    try {
      const { data } = await apiGetStock(symbol);
      this.setState({ latestPrice: data.quote.latestPrice });
      this.props.saveStock(data.quote);
      this.setState({ searchVal: "" });
    } catch (error) {
      message.error(error.response.data);
    }
  };

  render() {
    return (
      <div>
        <Input.Search
          allowClear
          type="text"
          placeholder="input search text"
          enterButton="Search"
          size="large"
          value={this.state.searchVal}
          onSearch={this.onClickSearch}
          onChange={this.onInputChange}
        />
        <h2>{this.state.latestPrice}</h2>
      </div>
    );
  }
}

export default connect(null, actions)(SearchBar);
