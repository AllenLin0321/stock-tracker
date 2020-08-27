import * as types from "actions/types";
const initialState = {
  tableLoading: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.TABLE_LOADING:
      return { ...state, ...payload };

    default:
      return state;
  }
};
