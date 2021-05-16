import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

import { onRemoveStock, onChangeOrder } from 'redux/slice/stockSlice';
import { numberToCurrency, getStockChangePercent } from 'utils';
import DetailDrawer from 'components/common/DetailDrawer';

const { Text } = Typography;
const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

const ListRecord = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedStock, setSelectedStock] = useState();
  const dispatch = useDispatch();
  const stocks = useSelector(state => state.stock.stocks);
  const tableLoading = useSelector(state => state.loading.tableLoading);

  if (!stocks || stocks.length === 0) return <Empty />;

  const columns = [
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
      sorter: (a, b) => getStockChangePercent(a) - getStockChangePercent(b),
      render: ({ change, previousClose }) => {
        const changePercent = getStockChangePercent({ change, previousClose });
        const isRise = changePercent > 0;
        return (
          <div>
            <div style={{ color: isRise ? 'green' : 'red' }}>
              {isRise && '+'}
              {change}
            </div>
            <Tag
              color={isRise ? 'green' : 'red'}
              icon={isRise ? <RiseOutlined /> : <FallOutlined />}
            >
              {isRise && '+'}
              {changePercent}%
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
              dispatch(onRemoveStock(rowData));
            }}
          />
        );
      },
    },
  ];

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newStockArr = arrayMove(
        [].concat(stocks),
        oldIndex,
        newIndex
      ).filter(el => !!el);
      dispatch(onChangeOrder(newStockArr));
    }
  };

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = stocks.findIndex(x => x.symbol === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  const DraggableContainer = props => (
    <SortableContainer
      {...props}
      useDragHandle
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
    />
  );

  return (
    <>
      <Table
        pagination={false}
        dataSource={stocks}
        columns={columns}
        rowKey="symbol"
        scroll={{ y: 200 }}
        loading={tableLoading}
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />

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

export default ListRecord;
