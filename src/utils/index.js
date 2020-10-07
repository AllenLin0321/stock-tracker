import moment from 'moment';
export * from 'utils/stock';

export const formatStockData = ({ quote }) => ({
  symbol: quote.symbol,
  latestPrice: quote.latestPrice,
  change: parseFloat((quote.latestPrice - quote.previousClose).toFixed(2)),
  high: quote.high,
  low: quote.low,
  previousClose: quote.previousClose,
  companyName: quote.companyName,
  week52High: quote.week52High,
  week52Low: quote.week52Low,
  updatedTime: moment().format('HH:mm'),
});

export const formatPortfolioData = ({
  quote,
  quantity = 1,
  defaultPrecent = 1,
}) => {
  const stockData = formatStockData({ quote });
  return {
    ...stockData,
    quantity,
    defaultPrecent,
  };
};

export const numberToCurrency = ({ num, hasSymbol = false, precision = 2 }) => {
  if (!num) return '';
  if (typeof num === 'number') num = num.toFixed(precision);
  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${hasSymbol ? '$' : ''}${parts.join('.')}`;
};
