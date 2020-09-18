import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Tag, Typography, Empty } from 'antd';
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

import * as actions from 'store/actions';
import { numberToCurrency } from 'utils';
import DetailDrawer from 'components/common/DetailDrawer';
import 'components/common/Record.scss';

const { Text } = Typography;
const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);
class Record extends React.Component {
  state = {
    drawerVisible: false,
    selectedStock: null,
  };

  columns = [
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
      title: <FormattedMessage id="record.latestPrice" />,
      key: 'latestPrice',
      render: rowData => (
        <Text>
          {numberToCurrency({ num: rowData.latestPrice, hasSymbol: true })}
        </Text>
      ),
    },
    {
      title: <FormattedMessage id="record.change" />,
      key: 'change',
      sorter: (a, b) => a.change - b.change,
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
  ];

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

    if (!stocks || stocks.length === 0) {
      return <Empty />;
    }

    const DraggableContainer = props => (
      <SortableContainer
        {...props}
        useDragHandle
        helperClass="row-dragging"
        onSortEnd={this.onSortEnd}
      />
    );
    return (
      <>
        <Table
          pagination={false}
          dataSource={stocks}
          columns={this.columns}
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
  return { stocks: state.stocks, loading: state.loading };
};

export default connect(mapStateToProps, actions)(Record);
