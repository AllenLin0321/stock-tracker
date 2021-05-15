import { createSlice } from '@reduxjs/toolkit';

const updateLocalStorage = newData => {
  localStorage.removeItem('portfolio');
  localStorage.setItem('portfolio', JSON.stringify(newData));
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: [],
  reducers: {},
});

export const {} = portfolioSlice.actions;

export default portfolioSlice;
