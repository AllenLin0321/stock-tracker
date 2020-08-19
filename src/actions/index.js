import { SAVE_STOCK } from "actions/types";

export const saveStock = payload => ({
  type: SAVE_STOCK,
  payload: {
    [payload.symbol]: payload,
  },
});
