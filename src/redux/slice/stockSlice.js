import { createSlice } from '@reduxjs/toolkit';

const updateLocalStorage = newData => {
  localStorage.removeItem('stocks');
  localStorage.setItem('stocks', JSON.stringify(newData));
};

const stockSlice = createSlice({
  name: 'stock',
  initialState: {},
  reducers: {},
});

export const {} = stockSlice.actions;

export default stockSlice;
