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
      className: 'drag-visible',
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
        const percent = getStockPercent({
          stock: rowData,
          stockArr: this.props.portfolio,
        });
        return (
          <InputNumber
            formatter={() => `${percent}%`}
            parser={value => value.replace('%', '')}
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
                formatter={() => `${percent}%`}
                parser={value => value.replace('%', '')}
              />
            );
          },
        },
      ],
    },
  ];

  render() {
    const { portfolio, loading } = this.props;
    return (
      <>
        <Table
          bordered
          pagination={false}
          dataSource={portfolio}
          columns={this.columns}
          rowKey="symbol"
          loading={loading.tableLoading}
        />
      </>
    );
  }
}

const mapStateToProps = state => {
  return { portfolio: state.portfolio, loading: state.loading };
};

export default connect(mapStateToProps, actions)(Record);
