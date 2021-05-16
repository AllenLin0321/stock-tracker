import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, InputNumber, Typography, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';

import {
  numberToCurrency,
  getStockPercent, //股票百分比
  getIndividualValue, //股票市值
  getTotalPercent, // 總投資百分比
  getNewQuantity, // 建議買賣股數
} from 'utils';
import { onChangeStockPercent } from 'redux/slice/portfolioSlice';
import DetailDrawer from 'components/common/DetailDrawer';
import 'components/common/Record.scss';

const { Text } = Typography;
const DEFAULT_DECIMAL = 2; // 小數點位數

const Record = props => {
  const dispatch = useDispatch();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedStock, setSelectedStock] = useState();
  const portfolio = useSelector(state => state.portfolio.stocks);
  const tableLoading = useSelector(state => state.loading.tableLoading);

  useEffect(() => {
    setExpandedRowKeys(
      props.isExpandAll ? portfolio.map(stock => stock.symbol) : []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isExpandAll]);

  /**
   * @description 實際交易金額
   * @param {Object} record 父層Row資料
   */
  const getInvestedValue = record => {
    const investedValue =
      getNewQuantity({
        portfolio: portfolio,
        newFund: props.newFund,
        record,
      }) * record.latestPrice;
    return investedValue;
  };

  /**
   * @description 交易後市值
   * @param {Object} record 父層Row資料
   */
  const getTradedValue = record => {
    const tradedValue =
      getNewQuantity({
        portfolio: portfolio,
        newFund: props.newFund,
        record,
      }) *
        record.latestPrice +
      getIndividualValue(record);
    return parseFloat(parseFloat(tradedValue).toFixed(DEFAULT_DECIMAL));
  };

  /**
   * @description 交易後比例
   * @param {Object} record 父層Row資料
   */
  const getTradedPercent = record => {
    if (!portfolio || portfolio.length === 0) return 0;
    const totalTradedValue = portfolio.reduce(
      (accu, curr) => accu + getTradedValue(curr),
      0
    );
    const tradedPercent = (getTradedValue(record) / totalTradedValue) * 100;
    return parseFloat(parseFloat(tradedPercent).toFixed(DEFAULT_DECIMAL));
  };

  const onExpandClick = (expanded, { symbol }) => {
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, symbol]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter(rowKey => rowKey !== symbol));
    }
  };

  const renderColumns = () => {
    let columns = [
      {
        title: <FormattedMessage id="record.name" />,
        key: 'symbol',
        render: rowData => (
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              setDrawerVisible(true);
              setSelectedStock(rowData);
            }}
          >
            {rowData.symbol}
          </Button>
        ),
      },
      {
        title: () => {
          const title = props.intl.formatMessage({
            id: 'record.defaultPercent',
          });
          const totalPercent = getTotalPercent(portfolio);
          return (
            <div>
              <Text>{title}</Text>
              <div>
                <Text type={totalPercent === 100 ? 'secondary' : 'warning'}>
                  (總和{totalPercent}%)
                </Text>
              </div>
            </div>
          );
        },
        key: 'defaultPercent',
        render: rowData => {
          return (
            <InputNumber
              value={rowData.defaultPrecent}
              min={0}
              max={100}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={newPercent => {
                dispatch(
                  onChangeStockPercent({ symbol: rowData.symbol, newPercent })
                );
              }}
            />
          );
        },
      },
      {
        title: '目前投資部位',
        children: [
          {
            title: <FormattedMessage id="record.latestPrice" />,
            key: 'latestPrice',
            render: rowData => (
              <Text>
                {numberToCurrency({
                  num: rowData.latestPrice,
                  hasSymbol: true,
                })}
              </Text>
            ),
          },
          {
            title: <FormattedMessage id="record.quantity" />,
            key: 'quantity',
            render: rowData => (
              <Text>
                {numberToCurrency({ num: rowData.quantity, precision: 4 })}
              </Text>
            ),
          },
          {
            title: <FormattedMessage id="record.value" />,
            key: 'value',
            render: rowData => {
              return (
                <Text>
                  {numberToCurrency({
                    num: getIndividualValue(rowData),
                    hasSymbol: true,
                  })}
                </Text>
              );
            },
          },
          {
            title: <FormattedMessage id="record.percent" />,
            key: 'percent',
            render: rowData => {
              const percent = getStockPercent({
                stock: rowData,
                stockArr: portfolio,
              });
              return (
                <InputNumber
                  disabled
                  value={percent}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                />
              );
            },
          },
          {
            title: <FormattedMessage id="record.shiftPercent" />,
            key: 'shiftPercent',
            render: rowData => {
              const percent = getStockPercent({
                stock: rowData,
                stockArr: portfolio,
              });

              const shiftPercent =
                ((percent - rowData.defaultPrecent) / rowData.defaultPrecent) *
                100;

              return (
                <Text type={shiftPercent > 0 ? 'default' : 'danger'}>
                  {shiftPercent.toFixed(DEFAULT_DECIMAL)}%
                </Text>
              );
            },
          },
        ],
      },
    ];

    return columns;
  };

  const renderInvestTable = record => {
    const columns = [
      {
        title: '建議買賣股數',
        children: [
          {
            title: <FormattedMessage id="record.action" />,
            key: 'action',
            render: () => {
              const newQuantity = getNewQuantity({
                portfolio: portfolio,
                newFund: props.newFund,
                record,
              });
              let displayText = '';
              if (newQuantity > 0) displayText = '買入';
              if (newQuantity < 0) displayText = '賣出';
              return (
                <Text type={newQuantity > 0 ? 'success' : 'danger'}>
                  {displayText}
                </Text>
              );
            },
          },
          {
            title: <FormattedMessage id="record.quantity" />,
            key: 'newQuantity',
            render: () => {
              const newQuantity = getNewQuantity({
                portfolio: portfolio,
                newFund: props.newFund,
                record,
              });

              return (
                <Text type={newQuantity > 0 ? 'success' : 'danger'}>
                  {numberToCurrency({ num: newQuantity, precision: 0 })}
                </Text>
              );
            },
          },
        ],
      },
      {
        title: '再平衡後',
        children: [
          {
            title: '實際交易金額',
            key: 'investedValue',
            render: () => {
              const newQuantity = getNewQuantity({
                portfolio: portfolio,
                newFund: props.newFund,
                record,
              });
              return (
                <Text type={newQuantity > 0 ? 'success' : 'danger'}>
                  {numberToCurrency({
                    num: getInvestedValue(record),
                    hasSymbol: true,
                  })}
                </Text>
              );
            },
          },
          {
            title: '交易後%',
            key: 'action',
            render: () => (
              <InputNumber
                disabled
                value={getTradedPercent(record)}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
              />
            ),
          },
          {
            title: '交易後市值',
            key: 'tradedValue',
            render: () => {
              return (
                <Text>
                  {numberToCurrency({
                    num: getTradedValue(record),
                    hasSymbol: true,
                  })}
                </Text>
              );
            },
          },
        ],
      },
    ];

    const tableConfig = {
      size: 'small',
      columns,
      bordered: true,
      dataSource: [{ key: 0 }],
      pagination: false,
    };

    return <Table {...tableConfig} />;
  };

  const renderTableFooter = () => {
    const reducer = (accu, curr) => accu + getInvestedValue(curr);
    const totalInvested = portfolio.reduce(reducer, 0);
    return (
      <div>
        <div>
          總交易金額:{' '}
          {numberToCurrency({ num: totalInvested, hasSymbol: true })}
        </div>
        <div>
          餘額:{' '}
          {numberToCurrency({
            num: props.newFund - totalInvested,
            hasSymbol: true,
          })}
        </div>
      </div>
    );
  };

  let tableConfig = {
    size: 'middle',
    rowKey: 'symbol',
    bordered: true,
    pagination: false,
    dataSource: portfolio,
    columns: renderColumns(),
    loading: tableLoading,
  };

  if (props.isAddNewFund) {
    tableConfig = {
      ...tableConfig,
      expandable: {
        expandedRowRender: renderInvestTable,
        expandedRowKeys: expandedRowKeys,
        onExpand: onExpandClick,
      },
      footer: () => renderTableFooter(),
    };
  }

  return (
    <>
      <Table {...tableConfig} />
      <DetailDrawer
        selectedStock={selectedStock}
        drawerVisible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
        }}
      />
    </>
  );
};

export default injectIntl(Record);
