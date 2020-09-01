import React, { Component } from "react";
import { Input, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { injectIntl } from "react-intl";

import "components/common/SearchBar.scss";
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
    this.setState({ isSearchBtnLoading: true });
    const res = await this.props.onClickSearch(symbol);
    if (res.isSuccess) {
      this.setState({ searchVal: "" });
    }
    this.setState({ isSearchBtnLoading: false });
  };

  onClickReload = async () => {
    this.setState({ isReloadLoading: true });
    await this.props.onClickReload();
    this.setState({ isReloadLoading: false });
  };

  render() {
    return (
      <div className="searchBar__wrapper">
        <Input.Search
          enterButton
          type="text"
          size="large"
          value={this.state.searchVal}
          loading={this.state.isSearchBtnLoading}
          placeholder={this.props.intl.formatMessage({
            id: "searchBar.placeholder",
          })}
          onSearch={this.onClickSearch}
          onChange={this.onInputChange}
        />
        <Button
          size="large"
          type="primary"
          icon={<ReloadOutlined />}
          className="searchBar__reload-btn"
          loading={this.state.isReloadLoading}
          onClick={this.onClickReload}
        />
      </div>
    );
  }
}

export default injectIntl(SearchBar);
