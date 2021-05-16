import React, { useEffect } from 'react';
import { message } from 'antd';

// REDUX
import { useDispatch, useSelector } from 'react-redux';
import { setTableLoading } from 'redux/slice/loadingSlice';
import { onSavePortfolio, initPortfolio } from 'redux/slice/portfolioSlice';

import { apiGetStock } from 'api';
import { formatPortfolioData } from 'utils';

// HOOKS
import useClickSearch from 'hooks/useClickSearch';

// COMPONENTS
import SearchBar from 'components/common/SearchBar.js';
import PortfolioRecord from 'components/portfolio/PortfolioRecord';

const Portfolio = () => {
  const dispatch = useDispatch();
  const portfolio = useSelector(state => state.portfolio.stocks);

  useEffect(() => {
    dispatch(initPortfolio()); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickSearch = useClickSearch({
    dispatchMethod: data => onSavePortfolio(formatPortfolioData(data)),
  });

  /**
   * @description 當點擊全部股票重新整理
   * @returns
   */
  const onClickReload = async () => {
    dispatch(setTableLoading(true));

    const delayIncrement = 200;
    let delay = 0;

    if (portfolio.length === 0) return;

    let promiseArr = portfolio.map(async stock => {
      delay += delayIncrement;

      return new Promise(resolve => setTimeout(resolve, delay)).then(() =>
        apiGetStock(stock.symbol)
      );
    });

    try {
      const res = await Promise.all(promiseArr);
      res.forEach(({ data }) => {
        let matchStock = portfolio.find(
          stock => stock.symbol === data.quote.symbol
        );

        let quantity = matchStock ? matchStock.quantity : null;
        let defaultPrecent = matchStock ? matchStock.defaultPrecent : null;

        dispatch(
          onSavePortfolio(
            formatPortfolioData({ ...data, quantity, defaultPrecent })
          )
        );
      });
    } catch (error) {
      error.response && message.error(error.response.data);
    } finally {
      dispatch(setTableLoading(false));
    }
  };

  return (
    <div>
      <SearchBar onClickSearch={onClickSearch} onClickReload={onClickReload} />
      <PortfolioRecord />
    </div>
  );
};

export default Portfolio;
