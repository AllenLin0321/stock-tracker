import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Tag, InputNumber, Space, Modal, Form } from 'antd';
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
import { DeleteOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

class Record extends React.Component {
  state = {
    modalVisible: false,
    selectedStock: null,
  };

  columns = [
    {
      title: '',
      dataIndex: 'sort',
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
      key: 'latestPrice',
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
      key: 'quantity',
      render: rowData => {
        return (
          <Button
            type="link"
            onClick={() => {
              this.setState({
                selectedStock: rowData,
                modalVisible: true,
              });
            }}
          >
            {rowData.quantity}
          </Button>
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
            formatter={() => `${percent}%`}
            parser={value => value.replace('%', '')}
          />
        );
      },
    },
  ];

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

  onModalFormSubmit = ({ quantity }) => {
    this.onQuantityChange(this.state.selectedStock, quantity);
    this.setState({ modalVisible: false, selectedStock: null });
  };

  onQuantityChange = (rowData, newQuantity) => {
    this.props.changeStockQuantity({
      ...rowData,
      quantity: newQuantity,
    });
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

    const DraggableBodyRow = ({ className, style, ...restProps }) => {
      const index = this.props.portfolio.findIndex(
        x => x.symbol === restProps['data-row-key']
      );
      return <SortableItem index={index} {...restProps} />;
    };

    return (
      <>
        <Table
          pagination={false}
          dataSource={portfolio}
          columns={this.columns}
          rowKey="symbol"
          scroll={{ y: 200 }}
          loading={loading.tableLoading}
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
        <Modal
          centered
          title={
            this.state.selectedStock ? this.state.selectedStock.symbol : ''
          }
          visible={this.state.modalVisible}
          footer={null}
          onCancel={() => this.setState({ modalVisible: false })}
        >
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={this.onModalFormSubmit}
          >
            <Form.Item
              label="股數"
              name="quantity"
              rules={[{ required: true, message: '請輸入股數' }]}
            >
              <InputNumber autoFocus size="large" step={0.0001} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                更新
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = state => {
  return { portfolio: state.portfolio, loading: state.loading };
};

export default connect(mapStateToProps, actions)(Record);
