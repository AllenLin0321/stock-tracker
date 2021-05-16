import React, { useEffect } from 'react';
import { apiGetStock } from 'api';
import { message } from 'antd';
import { formatStockData } from 'utils';

// REDUX
import { useDispatch, useSelector } from 'react-redux';
import {
  initStock,
  onSaveStock,
  onUpdateTriggerReload,
} from 'redux/slice/stockSlice';
import { setTableLoading } from 'redux/slice/loadingSlice';

// HOOKS
import useClickSearch from 'hooks/useClickSearch';

// COMPONENTS
import SearchBar from 'components/common/SearchBar.js';
import ListRecord from 'components/list/ListRecord';

const StockPage = () => {
  const dispatch = useDispatch();
  const stocks = useSelector(state => state.stock.stocks);
  const triggerReload = useSelector(state => state.stock.triggerReload);

  useEffect(() => {
    dispatch(initStock());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (triggerReload) {
      onClickReload();
    }
  }, [triggerReload]);

  const onClickSearch = useClickSearch({
    dispatchMethod: data => onSaveStock(formatStockData(data)),
  });

  const onClickReload = async () => {
    dispatch(setTableLoading(true));

    const delayIncrement = 250;
    let delay = 0;

    if (stocks.length === 0) return;

    let promiseArr = stocks.map(async stock => {
      delay += delayIncrement;
      return new Promise(resolve => setTimeout(resolve, delay)).then(() =>
        apiGetStock(stock.symbol)
      );
    });

    try {
      const res = await Promise.all(promiseArr);
      res.forEach(({ data }) => {
        dispatch(onSaveStock(formatStockData(data)));
      });
    } catch (error) {
      error.response && message.error(error.response.data);
    } finally {
      dispatch(setTableLoading(false));
      dispatch(onUpdateTriggerReload(false));
    }
  };
  return (
    <div>
      <SearchBar onClickSearch={onClickSearch} onClickReload={onClickReload} />
      <ListRecord />
    </div>
  );
};

export default StockPage;
