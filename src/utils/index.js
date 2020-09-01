import moment from "moment";
export const getStoreData = data => ({
  ...data.quote,
  updatedTime: moment().format("HH:mm"),
});
