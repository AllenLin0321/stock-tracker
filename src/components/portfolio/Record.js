import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Tag, InputNumber, Space } from 'antd';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import { FormattedMessage } from 'react-intl';
import { MenuOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
import { getStockPercent } from 'utils';
import * as actions from 'actions';
import 'components/list/Record.scss';
import {
  DeleteOutlined,
  RiseOutlined,
  FallOutlined,
  EditOutlined,
} from '@ant-design/icons';
const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

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
        title: <FormattedMessage id="record.latestPrice" />,
        dataIndex: 'latestPrice',
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
        title: <FormattedMessage id="record.quantity" />,
        dataIndex: 'quantity',
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
      {
        title: <FormattedMessage id="record.updatedTime" />,
        dataIndex: 'updatedTime',
      },
      {
        title: <FormattedMessage id="record.action" />,
        key: 'action',
        render: rowData => {
          return (
            <Space>
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => {
                  this.props.removePortfolio(rowData);
                }}
              />
              <Button
                type="danger"
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={() => {
                  this.props.removePortfolio(rowData);
                }}
              />
            </Space>
          );
        },
      },
    ],
  };

  onQuantityChange = (rowData, newQuantity) => {
    this.props.changeStockQuantity({
      ...rowData,
      quantity: newQuantity,
    });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newStockArr = arrayMove(
        [].concat(this.props.portfolio),
        oldIndex,
        newIndex
      ).filter(el => !!el);
      this.props.changePortfolioOrder({ newStockArr });
    }
  };

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { portfolio } = this.props;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = portfolio.findIndex(
      x => x.symbol === restProps['data-row-key']
    );
    return <SortableItem index={index} {...restProps} />;
  };

  render() {
    const { portfolio, loading } = this.props;
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
        dataSource={portfolio}
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
  return { portfolio: state.portfolio, loading: state.loading };
};

export default connect(mapStateToProps, actions)(Record);
