import moment from "moment";

export const getStoreData = ({ quote }) => ({
  symbol: quote.symbol,
  change: quote.change,
  latestPrice: quote.latestPrice,
  high: quote.high,
  low: quote.low,
  previousClose: quote.previousClose,
  updatedTime: moment().format("HH:mm"),
});

export const getPortfolioData = ({ quote }) => ({
  symbol: quote.symbol,
  latestPrice: quote.latestPrice,
  change: quote.change,
});
