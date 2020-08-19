import React, { Component } from "react";
import { Input, message } from "antd";
import { apiGetStock } from "../api";

export class SearchBar extends Component {
  state = { latestPrice: null };

  onClickSearch = async symbol => {
    try {
      const { data } = await apiGetStock(symbol);
      this.setState({ latestPrice: data.quote.latestPrice });
    } catch (error) {
      message.error(error.response.data);
    }
  };

  render() {
    return (
      <div>
        <Input.Search
          placeholder="input search text"
          enterButton="Search"
          size="large"
          onSearch={this.onClickSearch}
        />
        <h2>{this.state.latestPrice}</h2>
      </div>
    );
  }
}

export default SearchBar;
