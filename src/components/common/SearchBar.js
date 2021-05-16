import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { setTableLoading } from '../../redux/slice/loadingSlice';
import styled from 'styled-components';
import { Input, Button, AutoComplete, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { injectIntl } from 'react-intl';
import { apiSeachSymbol } from 'api';

const SearchBarWrapper = styled.div`
  display: flex;
`;

const apiDelaySecond = 500;

const SearchBar = props => {
  const dispatch = useDispatch();
  const [searchKeyword, setSearchKeyword] = useState();
  const [isReloadLoading, setIsReloadLoading] = useState(false);
  const [autoCompleteOption, setAutoCompleteOption] = useState([]);

  const debouncedSave = useCallback(
    debounce(newSearchValue => fetchOptions(newSearchValue), apiDelaySecond),
    []
  );

  const fetchOptions = async newSearchValue => {
    if (newSearchValue !== '') {
      const { data } = await apiSeachSymbol(newSearchValue);
      if (data.length === 0) {
        setAutoCompleteOption([]);
      }
      const newOption = data.map(symbolInfo => ({
        value: symbolInfo.symbol,
        label: (
          <div>
            <div style={{ fontWeight: 'bold' }}>{symbolInfo.name}</div>
            <div>{symbolInfo.symbol}</div>
          </div>
        ),
      }));
      setAutoCompleteOption(newOption);
    }
  };

  const onInputChange = event => {
    setSearchKeyword(event.target.value);
    debouncedSave(event.target.value);
  };

  const onOptionSelect = async symbol => {
    dispatch(setTableLoading(true));
    try {
      const res = await props.onClickSearch(symbol);
      if (res.isSuccess) {
        setSearchKeyword('');
        setAutoCompleteOption([]);
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data);
      }
    } finally {
      dispatch(setTableLoading(false));
    }
  };

  return (
    <SearchBarWrapper>
      <AutoComplete
        options={autoCompleteOption}
        style={{ width: '100%' }}
        onSelect={onOptionSelect}
        value={searchKeyword}
      >
        <Input
          type="text"
          size="large"
          placeholder={props.intl.formatMessage({
            id: 'searchBar.placeholder',
          })}
          onChange={onInputChange}
        />
      </AutoComplete>
      <Button
        size="large"
        type="primary"
        icon={<ReloadOutlined />}
        loading={isReloadLoading}
        onClick={props.onClickReload}
        style={{ marginLeft: '5px' }}
      />
    </SearchBarWrapper>
  );
};

export default injectIntl(SearchBar);
