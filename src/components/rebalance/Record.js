import React from 'react';
import { connect } from 'react-redux';
import { Table, InputNumber, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';

import { getStockPercent, toCurrency } from 'utils';
import * as actions from 'store/actions';

import 'components/common/Record.scss';

const { Text, Link } = Typography;

const DEFAULT_DECIMAL = 2; // 小數點位數

class Record extends React.Component {
  state = {
    expandedRowKeys: [],
  };

  componentDidUpdate(prevProps) {
    const { isExpandAll, portfolio } = this.props;
    if (isExpandAll !== prevProps.isExpandAll) {
      this.setState({
        expandedRowKeys: isExpandAll
          ? portfolio.map(stock => stock.symbol)
          : [],
      });
    }
  }

  /**
   * @description 各別投資市值
   * @param {Number} record.latestPrice 股票市價
   * @param {Number} record.quantity 擁有股數
   * @param {Number} decimal 回傳資料的小數點位數
   */
  getIndividualValue = record => {
    const individualValue = record.latestPrice * record.quantity;
    return parseFloat(individualValue.toFixed(DEFAULT_DECIMAL));
  };

  /**
   * @description 總投資百分比
   * @param {Number} decimal
   */
  getTotalPercent = () => {
    if (!this.props.portfolio || this.props.portfolio.length === 0) return 0;
    const totalPercent = this.props.portfolio.reduce(
      (accumulator, currentValue) =>
        accumulator + parseFloat(currentValue.defaultPrecent),
      0
    );

    return parseFloat(totalPercent.toFixed(DEFAULT_DECIMAL));
  };

  /**
   * @description 總投資價值
   * @param {Number} decimal
   */
  getTotalValue = () => {
    if (!this.props.portfolio || this.props.portfolio.length === 0) return 0;
    const totalValue = this.props.portfolio.reduce(
      (accumulator, currentValue) =>
        accumulator + this.getIndividualValue(currentValue),
      0
    );
    return parseFloat(totalValue.toFixed(DEFAULT_DECIMAL));
  };

  /**
   * @description 再平衡後市值
   * @param {Object} record 父層Row資料
   */
  getInventedValue = record => {
    const inventedValue =
      ((this.getTotalValue() + this.props.newFund) * record.defaultPrecent) /
      this.getTotalPercent();

    return parseFloat(parseFloat(inventedValue).toFixed(DEFAULT_DECIMAL));
  };

  /**
   * @description 應交易金額
   * @param {Object} record 父層Row資料
   */
  getShouldInventAmount = record => {
    const shouldInventAmount =
      this.getInventedValue(record) - this.getIndividualValue(record);
    return parseFloat(parseFloat(shouldInventAmount).toFixed(DEFAULT_DECIMAL));
  };

  /**
   * @description 建議買賣股數
   * @param {Object} record 父層Row資料
   */
  getNewQuantity = record => {
    const temp = this.getShouldInventAmount(record) / record.latestPrice;
    let newQuantity = Math.floor(temp);
    if (temp < 0) newQuantity++;
    return parseFloat(parseFloat(newQuantity).toFixed(DEFAULT_DECIMAL));
  };

  /**
   * @description 交易後市值
   * @param {Object} record 父層Row資料
   */
  getTradedValue = record => {
    const tradedValue =
      this.getNewQuantity(record) * record.latestPrice +
      this.getIndividualValue(record);
    return parseFloat(parseFloat(tradedValue).toFixed(DEFAULT_DECIMAL));
  };

  /**
   * @description 交易後比例
   * @param {Object} record 父層Row資料
   */
  getTradedPercent = record => {
    if (!this.props.portfolio || this.props.portfolio.length === 0) return 0;
    const totalTradedValue = this.props.portfolio.reduce(
      (accumulator, currentValue) =>
        accumulator + this.getTradedValue(currentValue),
      0
    );
    const tradedPercent =
      (this.getTradedValue(record) / totalTradedValue) * 100;
    return parseFloat(parseFloat(tradedPercent).toFixed(DEFAULT_DECIMAL));
  };

  onExpandClick = (expanded, { symbol }) => {
    if (expanded) {
      this.setState({
        expandedRowKeys: [...this.state.expandedRowKeys, symbol],
      });
    } else {
      this.setState({
        expandedRowKeys: this.state.expandedRowKeys.filter(
          rowKey => rowKey !== symbol
        ),
      });
    }
  };

  renderColumns = () => {
    let columns = [
      {
        title: <FormattedMessage id="record.name" />,
        key: 'symbol',
        render: rowData => (
          <Link
            href={`https://www.google.com/search?q=${rowData.symbol}+stock`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {rowData.symbol}
          </Link>
        ),
      },
      {
        title: () => {
          const title = this.props.intl.formatMessage({
            id: 'record.defaultPercent',
          });
          const totalPercent = this.getTotalPercent();
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
              onChange={newPercent =>
                this.props.changeDefaultPercent({ rowData, newPercent })
              }
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
                {toCurrency({
                  num: rowData.latestPrice.toFixed(DEFAULT_DECIMAL),
                  hasSymbol: true,
                })}
              </Text>
            ),
          },
          {
            title: <FormattedMessage id="record.quantity" />,
            key: 'quantity',
            render: rowData => (
              <Text>{toCurrency({ num: rowData.quantity.toFixed(4) })}</Text>
            ),
          },
          {
            title: <FormattedMessage id="record.value" />,
            key: 'value',
            render: rowData => {
              return (
                <Text>
                  {toCurrency({
                    num: this.getIndividualValue(rowData),
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
                stockArr: this.props.portfolio,
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
                stockArr: this.props.portfolio,
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

  renderInvestTable = record => {
    const columns = [
      {
        title: '建議買賣股數',
        children: [
          {
            title: <FormattedMessage id="record.action" />,
            key: 'action',
            render: () => {
              const newQuantity = this.getNewQuantity(record);
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
              const newQuantity = this.getNewQuantity(record);

              return (
                <Text type={newQuantity > 0 ? 'success' : 'danger'}>
                  {toCurrency({ num: newQuantity })}
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
            title: '再平衡後市值',
            key: 'inventedValue',
            render: () => {
              return (
                <Text>
                  {toCurrency({
                    num: this.getInventedValue(record),
                    hasSymbol: true,
                  })}
                </Text>
              );
            },
          },
          {
            title: '應交易金額',
            key: 'shouldInventAmount',
            render: () => {
              return (
                <Text>
                  {toCurrency({
                    num: this.getShouldInventAmount(record),
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
                value={this.getTradedPercent(record)}
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
                  {toCurrency({
                    num: this.getTradedValue(record),
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

  render() {
    let tableConfig = {
      size: 'middle',
      rowKey: 'symbol',
      bordered: true,
      pagination: false,
      dataSource: this.props.portfolio,
      columns: this.renderColumns(),
      loading: this.props.loading.tableLoading,
    };

    if (this.props.isAddNewFund) {
      tableConfig = {
        ...tableConfig,
        expandable: {
          expandedRowRender: this.renderInvestTable,
          expandedRowKeys: this.state.expandedRowKeys,
          onExpand: this.onExpandClick,
        },
      };
    }

    return <Table {...tableConfig} />;
  }
}

const mapStateToProps = state => {
  return {
    portfolio: state.portfolio,
    loading: state.loading,
  };
};

export default connect(mapStateToProps, actions)(injectIntl(Record));
