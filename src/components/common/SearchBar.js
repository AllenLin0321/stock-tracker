import React, { Component } from 'react';
import { Input, Button, AutoComplete } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { injectIntl } from 'react-intl';
import { apiSeachSymbol } from 'api';

import 'components/common/SearchBar.scss';
export class SearchBar extends Component {
  state = {
    searchVal: null,
    isSearchBtnLoading: false,
    isReloadLoading: false,
    autoCompleteOption: [],
  };

  onInputChange = event => {
    this.setState({ searchVal: event.target.value.toUpperCase() }, async () => {
      if (this.state.searchVal !== '') {
        const { data } = await apiSeachSymbol(this.state.searchVal);
        if (data.length === 0) this.setState({ autoCompleteOption: [] });
        const newOption = data.map(symbolInfo => ({
          value: symbolInfo.symbol,
          label: (
            <div>
              <div style={{ fontWeight: 'bold' }}>{symbolInfo.name}</div>
              <div>{symbolInfo.symbol}</div>
            </div>
          ),
        }));
        this.setState({ autoCompleteOption: newOption });
      }
    });
  };

  onOptionSelect = async symbol => {
    this.setState({ isSearchBtnLoading: true });
    const res = await this.props.onClickSearch(symbol);
    if (res.isSuccess) {
      this.setState({ searchVal: '' });
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
        <AutoComplete
          options={this.state.autoCompleteOption}
          style={{ width: '100%' }}
          onSelect={this.onOptionSelect}
          value={this.state.searchVal}
        >
          <Input.Search
            enterButton
            type="text"
            size="large"
            loading={this.state.isSearchBtnLoading}
            placeholder={this.props.intl.formatMessage({
              id: 'searchBar.placeholder',
            })}
            onChange={this.onInputChange}
          />
        </AutoComplete>
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
