import React from 'react';
import { connect } from 'react-redux';
import { Table, InputNumber, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';

import { getStockPercent, toCurrency } from 'utils';
import * as actions from 'actions';

import 'components/common/Record.scss';

const { Text, Link } = Typography;

class Record extends React.Component {
  columns = [
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
            const num = (rowData.latestPrice * rowData.quantity).toFixed(2);
            return <Text>{toCurrency({ num, hasSymbol: true })}</Text>;
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
