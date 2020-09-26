const DEFAULT_DECIMAL = 2; // 小數點位數

const stockValueReducer = (accu, curr) =>
  parseFloat(
    (accu + curr.quantity * curr.latestPrice).toFixed(DEFAULT_DECIMAL)
  );

/**
 * @description 總投資價值
 */
const getTotalValue = portfolio => {
  if (!portfolio || portfolio.length === 0) return 0;
  const totalValue = portfolio.reduce(
    (accu, curr) => accu + getIndividualValue(curr),
    0
  );
  return parseFloat(totalValue.toFixed(DEFAULT_DECIMAL));
};

/**
 * @description 再平衡後市值
 * @param {Object} record 父層Row資料
 */
const getInventedValue = ({ portfolio, newFund, record }) => {
  const inventedValue =
    ((getTotalValue(portfolio) + newFund) * record.defaultPrecent) /
    getTotalPercent(portfolio);

  return parseFloat(parseFloat(inventedValue).toFixed(DEFAULT_DECIMAL));
};

/**
 * @description 應交易金額
 * @param {Object} record 父層Row資料
 */
const getShouldInventAmount = ({ portfolio, newFund, record }) => {
  const shouldInventAmount =
    getInventedValue({ portfolio, newFund, record }) -
    getIndividualValue(record);
  return parseFloat(parseFloat(shouldInventAmount).toFixed(DEFAULT_DECIMAL));
};

/**
 * @description 股票百分比
 */
export const getStockPercent = ({ stock, stockArr }) => {
  const stockValue = parseFloat(
    (stock.quantity * stock.latestPrice).toFixed(DEFAULT_DECIMAL)
  );
  const totalValue = stockArr.reduce(stockValueReducer, 0);
  return parseFloat(((stockValue / totalValue) * 100).toFixed(DEFAULT_DECIMAL));
};

/**
 * @description 取得漲跌幅
 * @param {Number} change  當日變化
 * @param {Number} previousClose  前一日收盤價
 */
export const getStockChangePercent = (
  { change, previousClose },
  precision = DEFAULT_DECIMAL
) => {
  const changePercent = (change / previousClose) * 100;
  return parseFloat(changePercent.toFixed(precision));
};

/**
 * @description 股票市值
 * @param {Number} record.latestPrice 股票市價
 * @param {Number} record.quantity 擁有股數
 */
export const getIndividualValue = record => {
  const individualValue = record.latestPrice * record.quantity;
  return parseFloat(individualValue.toFixed(DEFAULT_DECIMAL));
};

/**
 * @description 總投資百分比
 */
export const getTotalPercent = portfolio => {
  if (!portfolio || portfolio.length === 0) return 0;
  const totalPercent = portfolio.reduce(
    (accu, curr) => accu + parseFloat(curr.defaultPrecent),
    0
  );

  return parseFloat(totalPercent.toFixed(DEFAULT_DECIMAL));
};

/**
 * @description 建議買賣股數
 * @param {Object} record 父層Row資料
 */
export const getNewQuantity = ({ portfolio, newFund, record }) => {
  const temp =
    getShouldInventAmount({ portfolio, newFund, record }) / record.latestPrice;
  let newQuantity = Math.floor(temp);
  if (temp < 0) newQuantity++;
  return parseFloat(parseFloat(newQuantity).toFixed(DEFAULT_DECIMAL));
};
