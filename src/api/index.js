import axios from "axios";

const stockRequest = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const apiGetStock = symbol =>
  stockRequest.get(`/stock/${symbol}/batch`, {
    params: {
      token: process.env.REACT_APP_API_TOKEN,
      last: 10,
      range: "1m",
      types: "quote",
    },
  });
