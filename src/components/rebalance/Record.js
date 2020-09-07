import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, InputNumber } from 'antd';
import { FormattedMessage } from 'react-intl';

import { getStockPercent, toCurrency } from 'utils';
import * as actions from 'actions';

import 'components/list/Record.scss';

class Record extends React.Component {
  columns = [
    {
      title: <FormattedMessage id="record.name" />,
      key: 'symbol',
      render: rowData => (
        <Button
          type="link"
          href={`https://www.google.com/search?q=${rowData.symbol}+stock`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {rowData.symbol}
        </Button>
      ),
    },
    {
      title: <FormattedMessage id="record.defaultPercent" />,
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
            <span>
              {toCurrency({
                num: rowData.latestPrice.toFixed(2),
                hasSymbol: true,
              })}
            </span>
          ),
        },
        {
          title: <FormattedMessage id="record.quantity" />,
          key: 'quantity',
          render: rowData => (
            <span>{toCurrency({ num: rowData.quantity.toFixed(4) })}</span>
          ),
        },
        {
          title: <FormattedMessage id="record.value" />,
          key: 'value',
          render: rowData => {
            const num = (rowData.latestPrice * rowData.quantity).toFixed(2);
            return <span>{toCurrency({ num, hasSymbol: true })}</span>;
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
      ],
    },
  ];

  render() {
    return (
      <Table
        bordered
        pagination={false}
        dataSource={this.props.portfolio}
        columns={this.columns}
        rowKey="symbol"
        loading={this.props.loading.tableLoading}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    portfolio: state.portfolio,
    loading: state.loading,
    rebalance: state.rebalance,
  };
};

export default connect(mapStateToProps, actions)(Record);
