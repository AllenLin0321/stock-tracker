import React from 'react';
import { connect } from 'react-redux';
import { Table, InputNumber, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';

import { getStockPercent, toCurrency } from 'utils';
import * as actions from 'actions';

import 'components/common/Record.scss';

const { Text, Link } = Typography;

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
   * @param {Number} stockObj.latestPrice 股票市價
   * @param {Number} stockObj.quantity 擁有股數
   * @param {Number} decimal 回傳資料的小數點位數
   */
  getIndividualValue = (stockObj, decimal = 2) => {
    const value = (stockObj.latestPrice * stockObj.quantity).toFixed(2);
    return parseFloat(value).toFixed(decimal);
  };

  getTotalPercent = (decimal = 2) => {
    if (!this.props.portfolio || this.props.portfolio.length === 0) return 0;
    const totalPercent = this.props.portfolio.reduce(
      (accumulator, currentValue) => accumulator + currentValue.defaultPrecent,
      0
    );
    return parseFloat(totalPercent.toFixed(decimal));
  };

  getTotalValue = (decimal = 2) => {
    if (!this.props.portfolio || this.props.portfolio.length === 0) return 0;
    const totalValue = this.props.portfolio.reduce(
      (accumulator, currentValue) =>
        accumulator + this.getIndividualValue(currentValue),
      0
    );

    return parseFloat(totalValue).toFixed(decimal);
  };

  /**
   * @description 再平衡後市值
   * @param {Object} record 父層Row資料
   */
  getInventedValue = (record, decimal = 0) => {
    const inventedValue =
      ((this.getTotalValue() + this.props.newFund) * record.defaultPrecent) /
      this.getTotalPercent();
    return inventedValue.toFixed(decimal);
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
                  num: rowData.latestPrice.toFixed(2),
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
                (percent - rowData.defaultPrecent) / rowData.defaultPrecent;

              return (
                <Text type={shiftPercent > 0 ? 'default' : 'danger'}>
                  {shiftPercent.toFixed(2)}%
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
            render: () => <Text type="success">買入</Text>,
          },
          {
            title: <FormattedMessage id="record.quantity" />,
            key: 'newQuantity',
            render: () => {
              return <Text>{toCurrency({ num: 4 })}</Text>;
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
              const shouldInventAmount =
                this.getInventedValue(record) - this.getIndividualValue(record);
              return (
                <Text>
                  {toCurrency({
                    num: shouldInventAmount.toFixed(2),
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
                value={60}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
              />
            ),
          },
          {
            title: '交易後市值',
            key: 'newQuantity',
            render: () => {
              return (
                <Text>{toCurrency({ num: 21916.33, hasSymbol: true })}</Text>
              );
            },
          },
        ],
      },
    ];
    const data = [
      {
        key: 0,
        date: '2014-12-24 23:12:00',
        name: 'This is production name',
        upgradeNum: 'Upgraded: 56',
      },
    ];

    const tableConfig = {
      size: 'small',
      columns,
      bordered: true,
      dataSource: data,
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
