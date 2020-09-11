import moment from 'moment';

const stockValueReducer = (accumulator, currentValue) =>
  parseFloat(
    (accumulator + currentValue.quantity * currentValue.latestPrice).toFixed(2)
  );

export const formatStockData = ({ quote }) => ({
  symbol: quote.symbol,
  change: quote.change,
  latestPrice: quote.latestPrice,
  high: quote.high,
  low: quote.low,
  previousClose: quote.previousClose,
  updatedTime: moment().format('HH:mm'),
});

export const formatPortfolioData = ({
  quote,
  quantity = 1,
  defaultPrecent = 1,
}) => ({
  symbol: quote.symbol,
  latestPrice: quote.latestPrice,
  change: quote.change,
  previousClose: quote.previousClose,
  quantity,
  updatedTime: moment().format('HH:mm'),
  defaultPrecent,
});

export const getStockPercent = ({ stock, stockArr }) => {
  const stockValue = parseFloat(
    (stock.quantity * stock.latestPrice).toFixed(2)
  );
  const totalValue = stockArr.reduce(stockValueReducer, 0);
  return parseFloat(((stockValue / totalValue) * 100).toFixed(2));
};

export const numberToCurrency = ({ num, hasSymbol = false }) => {
  if (!num) return '';
  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${hasSymbol ? '$' : ''}${parts.join('.')}`;
};
