import axios from 'axios';

const stockRequest = axios.create({
  baseURL: process.env.REACT_APP_STOCK_API_URL,
});

const symbolRequest = axios.create({
  baseURL: process.env.REACT_APP_SYMBOL_API_URL,
});
const currencyRequest = axios.create({
  baseURL: process.env.REACT_APP_CURRENCY_API_URL,
});

export const apiGetStock = symbol =>
  stockRequest.get(`/stock/${symbol}/book`, {
    params: {
      token: process.env.REACT_APP_API_TOKEN,
    },
  });

export const apiGetLogo = symbol =>
  stockRequest.get(`/stock/${symbol}/logo`, {
    params: {
      token: process.env.REACT_APP_API_TOKEN,
    },
  });

export const apiSeachSymbol = keyword =>
  symbolRequest.get(`/keyword/${keyword}`);

export const apiGetCurrency = () =>
  currencyRequest.get('api/v7/convert', {
    params: {
      q: 'USD_TWD',
      compact: 'ultra',
      apiKey: process.env.REACT_APP_CURRENCY_API_TOKEN,
    },
  });
