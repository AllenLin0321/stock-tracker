import moment from 'moment';

export const getStoreData = ({ quote }) => ({
  symbol: quote.symbol,
  change: quote.change,
  latestPrice: quote.latestPrice,
  high: quote.high,
  low: quote.low,
  previousClose: quote.previousClose,
  updatedTime: moment().format('HH:mm'),
});

export const getPortfolioData = ({ quote }, quantity = 1) => ({
  symbol: quote.symbol,
  latestPrice: quote.latestPrice,
  change: quote.change,
  previousClose: quote.previousClose,
  quantity,
  updatedTime: moment().format('HH:mm'),
});
