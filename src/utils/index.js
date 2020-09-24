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

export const getStockPercent = ({ stock, stockArr }) => {
  const stockValue = parseFloat(
    (stock.quantity * stock.latestPrice).toFixed(2)
  );
  const totalValue = stockArr.reduce(stockValueReducer, 0);
  return parseFloat(((stockValue / totalValue) * 100).toFixed(2));
};

/**
 * @description 取得漲跌幅
 * @param {Number} change  當日變化
 * @param {Number} previousClose  前一日收盤價
 */
export const getStockChangePercent = (
  { change, previousClose },
  precision = 2
) => {
  const changePercent = (change / previousClose) * 100;
  return parseFloat(changePercent.toFixed(precision));
};

export const numberToCurrency = ({ num, hasSymbol = false, precision = 2 }) => {
  if (!num) return '';
  if (typeof num === 'number') num = num.toFixed(precision);
  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${hasSymbol ? '$' : ''}${parts.join('.')}`;
};
