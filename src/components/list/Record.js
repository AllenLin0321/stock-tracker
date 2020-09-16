import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Tag, Typography, Empty, Drawer, Space } from 'antd';
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
import 'components/common/Record.scss';

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);
const { Text } = Typography;
class Record extends React.Component {
  state = {
    visible: false,
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
          onClick={() =>
            this.setState({ visible: true, selectedStock: rowData })
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
      title: <FormattedMessage id="record.high" />,
      key: 'high',
      render: rowData => {
        if (!rowData.high) return <Text>-</Text>;
        return (
          <Text>
            {numberToCurrency({ num: rowData.high, hasSymbol: true })}
          </Text>
        );
      },
    },
    {
      title: <FormattedMessage id="record.low" />,
      key: 'low',
      render: rowData => {
        if (!rowData.low) return <Text>-</Text>;
        return (
          <Text>{numberToCurrency({ num: rowData.low, hasSymbol: true })}</Text>
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

  renderDrawerTitle = () => {
    const { symbol, companyName } = this.state.selectedStock;
    return (
      <Space>
        <img
          src={`https://storage.googleapis.com/iexcloud-hl37opg/api/logos/${symbol}.png`}
          style={{ width: '30px' }}
          alt={`${symbol}_Logo`}
        ></img>
        {companyName}
      </Space>
    );
  };

  renderDrawer = () => {
    const { selectedStock } = this.state;
    if (!selectedStock) return false;

    return (
      <Drawer
        destroyOnClose
        title={this.renderDrawerTitle()}
        closable={false}
        onClose={() => this.setState({ visible: false })}
        visible={this.state.visible}
      >
        // TODO: 添加股票資料
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    );
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

        {this.renderDrawer()}
      </>
    );
  }
}

const mapStateToProps = state => {
  return { stocks: state.stocks, loading: state.loading };
};

export default connect(mapStateToProps, actions)(Record);
