import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Tag, Typography } from 'antd';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import { FormattedMessage } from 'react-intl';
import {
  MenuOutlined,
  DeleteOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import arrayMove from 'array-move';

import * as actions from 'actions';
import { toCurrency } from 'utils';
import 'components/common/Record.scss';

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);
const { Text, Link } = Typography;
class Record extends React.Component {
  state = {
    columns: [
      {
        title: '',
        dataIndex: 'sort',
        width: 30,
        className: 'drag-visible',
        render: () => <DragHandle />,
      },
      {
        title: <FormattedMessage id="record.name" />,
        key: 'symbol',
        className: 'drag-visible',
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
        title: <FormattedMessage id="record.latestPrice" />,
        key: 'latestPrice',
        render: rowData => (
          <Text>
            {toCurrency({ num: rowData.latestPrice, hasSymbol: true })}
          </Text>
        ),
      },
      {
        title: <FormattedMessage id="record.change" />,
        key: 'change',
        render: rowData => {
          const changePercent = (rowData.change / rowData.previousClose) * 100;
          const isRise = changePercent > 0;
          return (
            <div>
              <div style={{ color: isRise ? 'green' : 'red' }}>
                {isRise && '+'}
                {rowData.change}
              </div>
              <Tag
                color={isRise ? 'green' : 'red'}
                icon={isRise ? <RiseOutlined /> : <FallOutlined />}
              >
                {isRise && '+'}
                {changePercent.toFixed(2)}%
              </Tag>
            </div>
          );
        },
      },
      {
        title: <FormattedMessage id="record.high" />,
        key: 'high',
        render: rowData => {
          if (!rowData.high) return <Text>-</Text>;
          return (
            <Text>{toCurrency({ num: rowData.high, hasSymbol: true })}</Text>
          );
        },
      },
      {
        title: <FormattedMessage id="record.low" />,
        key: 'low',
        render: rowData => {
          if (!rowData.low) return <Text>-</Text>;
          return (
            <Text>{toCurrency({ num: rowData.low, hasSymbol: true })}</Text>
          );
        },
      },
      {
        title: <FormattedMessage id="record.updatedTime" />,
        key: 'updatedTime',
        render: rowData => <Text type="secondary">{rowData.updatedTime}</Text>,
      },
      {
        title: <FormattedMessage id="record.action" />,
        key: 'action',
        render: rowData => {
          return (
            <Button
              type="danger"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => {
                this.props.removeStock(rowData);
              }}
            />
          );
        },
      },
    ],
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newStockArr = arrayMove(
        [].concat(this.props.stocks),
        oldIndex,
        newIndex
      ).filter(el => !!el);
      this.props.changeStockOrder({ newStockArr });
    }
  };

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { stocks } = this.props;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = stocks.findIndex(x => x.symbol === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  render() {
    const { stocks, loading } = this.props;
    const DraggableContainer = props => (
      <SortableContainer
        {...props}
        useDragHandle
        helperClass="row-dragging"
        onSortEnd={this.onSortEnd}
      />
    );
    return (
      <Table
        pagination={false}
        dataSource={stocks}
        columns={this.state.columns}
        rowKey="symbol"
        scroll={{ y: 200 }}
        loading={loading.tableLoading}
        components={{
          body: {
            wrapper: DraggableContainer,
            row: this.DraggableBodyRow,
          },
        }}
      />
    );
  }
}

const mapStateToProps = state => {
  return { stocks: state.stocks, loading: state.loading };
};

export default connect(mapStateToProps, actions)(Record);
