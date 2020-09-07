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
      title: () => {
        const title = this.props.intl.formatMessage({
          id: 'record.defaultPercent',
        });
        const totalPercent = this.props.portfolio.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.defaultPrecent,
          0
        );
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
  };
};

export default connect(mapStateToProps, actions)(injectIntl(Record));
