import React from "react";
import { Provider } from "react-redux";
import { createStore, compose } from "redux";
import reducers from "reducers/index";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default ({ initialState = {}, children }) => {
  return (
    <Provider store={createStore(reducers, initialState, composeEnhancers())}>
      {children}
    </Provider>
  );
};
