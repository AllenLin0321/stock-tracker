import React, { Component } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { Input, Button, AutoComplete } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { injectIntl } from 'react-intl';
import { apiSeachSymbol } from 'api';

const SearchBarWrapper = styled.div`
  display: flex;
`;

const apiDelaySecond = 300;

export class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchVal: null,
      isReloadLoading: false,
      autoCompleteOption: [],
    };

    this.inputSearch = _.debounce(async () => {
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
    }, apiDelaySecond);
  }

  onInputChange = event => {
    this.setState({ searchVal: event.target.value }, this.inputSearch);
  };

  onOptionSelect = async symbol => {
    this.props.setTableLoading({ tableLoading: true });
    const res = await this.props.onClickSearch(symbol);
    if (res.isSuccess) {
      this.setState({ searchVal: '', autoCompleteOption: [] });
    }
    this.props.setTableLoading({ tableLoading: false });
  };

  onClickReload = async () => {
    this.setState({ isReloadLoading: true });
    await this.props.onClickReload();
    this.setState({ isReloadLoading: false });
  };

  render() {
    return (
      <SearchBarWrapper>
        <AutoComplete
          options={this.state.autoCompleteOption}
          style={{ width: '100%' }}
          onSelect={this.onOptionSelect}
          value={this.state.searchVal}
        >
          <Input
            type="text"
            size="large"
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
          loading={this.state.isReloadLoading}
          onClick={this.onClickReload}
          style={{ marginLeft: '5px' }}
        />
      </SearchBarWrapper>
    );
  }
}

export default injectIntl(SearchBar);
