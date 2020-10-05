import React from 'react';
import { connect } from 'react-redux';
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
import * as actions from 'store/actions';
import DetailDrawer from 'components/common/DetailDrawer';
import 'components/common/Record.scss';

const { Text } = Typography;
const DEFAULT_DECIMAL = 2; // 小數點位數

class Record extends React.Component {
  state = {
    expandedRowKeys: [],
    drawerVisible: false,
    selectedStock: null,
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
   * @description 實際交易金額
   * @param {Object} record 父層Row資料
   */
  getInvestedValue = record => {
    const investedValue =
      getNewQuantity({
        portfolio: this.props.portfolio,
        newFund: this.props.newFund,
        record,
      }) * record.latestPrice;
    return investedValue;
  };

  /**
   * @description 交易後市值
   * @param {Object} record 父層Row資料
   */
  getTradedValue = record => {
    const tradedValue =
      getNewQuantity({
        portfolio: this.props.portfolio,
        newFund: this.props.newFund,
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
  getTradedPercent = record => {
    if (!this.props.portfolio || this.props.portfolio.length === 0) return 0;
    const totalTradedValue = this.props.portfolio.reduce(
      (accu, curr) => accu + this.getTradedValue(curr),
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
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() =>
              this.setState({ drawerVisible: true, selectedStock: rowData })
            }
          >
            {rowData.symbol}
          </Button>
        ),
      },
      {
        title: () => {
          const title = this.props.intl.formatMessage({
            id: 'record.defaultPercent',
          });
          const totalPercent = getTotalPercent(this.props.portfolio);
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
              const newQuantity = getNewQuantity({
                portfolio: this.props.portfolio,
                newFund: this.props.newFund,
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
                portfolio: this.props.portfolio,
                newFund: this.props.newFund,
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
              return (
                <Text>
                  {numberToCurrency({
                    num: this.getInvestedValue(record),
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
                  {numberToCurrency({
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

  renderTableFooter = () => {
    const reducer = (accu, curr) => accu + this.getInvestedValue(curr);
    const totalInvested = this.props.portfolio.reduce(reducer, 0);
    return (
      <div>
        <div>
          總交易金額:{' '}
          {numberToCurrency({ num: totalInvested, hasSymbol: true })}
        </div>
        <div>
          餘額:{' '}
          {numberToCurrency({
            num: this.props.newFund - totalInvested,
            hasSymbol: true,
          })}
        </div>
      </div>
    );
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
        footer: () => this.renderTableFooter(),
      };
    }

    return (
      <>
        <Table {...tableConfig} />
        <DetailDrawer
          selectedStock={this.state.selectedStock}
          drawerVisible={this.state.drawerVisible}
          onClose={() => {
            this.setState({ drawerVisible: false });
          }}
        />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    portfolio: state.portfolio,
    loading: state.loading,
  };
};

export default connect(mapStateToProps, actions)(injectIntl(Record));
