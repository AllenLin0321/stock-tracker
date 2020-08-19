import * as types from "actions/types";
const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.SAVE_STOCK:
      return { ...state, ...payload };

    default:
      return state;
  }
};
