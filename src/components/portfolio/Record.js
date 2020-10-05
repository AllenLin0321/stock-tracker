import React from 'react';
import { connect } from 'react-redux';
import {
  Table,
  Button,
  Tag,
  InputNumber,
  Modal,
  Form,
  Typography,
  Empty,
  Statistic,
  Space,
  Tooltip,
  message,
} from 'antd';
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
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  TransactionOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import arrayMove from 'array-move';
import {
  getStockPercent,
  numberToCurrency,
  getStockChangePercent,
} from 'utils';
import * as actions from 'store/actions';
import { apiGetCurrency } from 'api';
import DetailDrawer from 'components/common/DetailDrawer';
import 'components/common/Record.scss';

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));
const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);
const { Text, Link } = Typography;
const CURRENCY = {
  USD: 'USD',
  TWD: 'TWD',
};

class Record extends React.Component {
  state = {
    modalVisible: false,
    selectedStock: null,
    isTotalValueVisable: true,
    currency: CURRENCY.USD,
    exchangeRate: 1,
    isTransferLoading: false,
    drawerVisible: false,
    showExchangeRate: false,
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
      title: <FormattedMessage id="record.quantity" />,
      key: 'quantity',
      render: rowData => {
        return (
          <Link
            onClick={() => {
              this.setState({
                selectedStock: rowData,
                modalVisible: true,
              });
            }}
          >
            {numberToCurrency({ num: rowData.quantity, precision: 4 })}
          </Link>
        );
      },
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
              this.props.removePortfolio(rowData);
            }}
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

  renderStatisticTitle = () => {
    const {
      isTotalValueVisable,
      exchangeRate,
      isTransferLoading,
      showExchangeRate,
    } = this.state;
    const eyeIconConfig = {
      onClick: () =>
        this.setState({
          isTotalValueVisable: !this.state.isTotalValueVisable,
        }),
    };

    const transferIconConfig = {
      onClick: async () => {
        this.setState({ isTransferLoading: true, showExchangeRate: false });

        try {
          const { data } = await apiGetCurrency();
          this.setState({
            showExchangeRate: this.state.currency === CURRENCY.USD,
            exchangeRate: data.USD_TWD,
            currency:
              this.state.currency === CURRENCY.USD
                ? CURRENCY.TWD
                : CURRENCY.USD,
          });
        } catch (error) {
          console.log('error: ', error);
          if (error.response) {
            message.error(error.response.data);
          }
        } finally {
          this.setState({ isTransferLoading: false });
        }
      },
    };

    return (
      <Text>
        總資產{' '}
        <Space>
          <Tooltip placement="top" title="顯示⇄隱藏">
            {isTotalValueVisable ? (
              <EyeOutlined {...eyeIconConfig} />
            ) : (
              <EyeInvisibleOutlined {...eyeIconConfig} />
            )}
          </Tooltip>
          {
            <Tooltip placement="top" title="美元⇄新台幣">
              <TransactionOutlined {...transferIconConfig} />
            </Tooltip>
          }
          {isTransferLoading && <LoadingOutlined />}
          {showExchangeRate && (
            <Text type="secondary">1 USD = TWD {exchangeRate.toFixed(3)}</Text>
          )}
        </Space>
      </Text>
    );
  };

  renderTableFooter = () => {
    const { portfolio } = this.props;
    const { isTotalValueVisable, currency, exchangeRate } = this.state;
    if (!portfolio || portfolio.length === 0) return false;
    let totalValue = portfolio.reduce(
      (accu, { latestPrice, quantity }) => accu + latestPrice * quantity,
      0
    );
    const totalChange = portfolio.reduce((accu, cuur) => {
      const changePercent = (cuur.change / cuur.previousClose) * 100;
      const percent = getStockPercent({
        stock: cuur,
        stockArr: portfolio,
      });
      return accu + (changePercent * percent) / 100;
    }, 0);

    let totalValueChange = portfolio.reduce((accu, cuur) => {
      return accu + (cuur.latestPrice - cuur.previousClose) * cuur.quantity;
    }, 0);
    const currencySymbol = currency === CURRENCY.USD ? '$ ' : 'NT$ ';
    if (currency === CURRENCY.TWD) {
      totalValue = totalValue * exchangeRate;
      totalValueChange = totalValueChange * exchangeRate;
    }
    return (
      <span>
        <Statistic
          title={this.renderStatisticTitle()}
          value={`${currencySymbol}${
            isTotalValueVisable
              ? numberToCurrency({
                  num: totalValue,
                })
              : '*****'
          }`}
        />
        {isTotalValueVisable && (
          <Text style={{ color: totalValueChange > 0 ? '#3f8600' : '#cf1322' }}>
            {totalValueChange > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {currencySymbol +
              numberToCurrency({
                num: totalValueChange,
              })}{' '}
            ({totalChange.toFixed(2)}%)
          </Text>
        )}
      </span>
    );
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

    if (!portfolio || portfolio.length === 0) {
      return <Empty />;
    }

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
          footer={() => this.renderTableFooter()}
        />
        <DetailDrawer
          selectedStock={this.state.selectedStock}
          drawerVisible={this.state.drawerVisible}
          onClose={() => {
            this.setState({ drawerVisible: false });
          }}
        />
        <Modal
          destroyOnClose
          centered
          footer={null}
          title={
            this.state.selectedStock ? this.state.selectedStock.symbol : ''
          }
          visible={this.state.modalVisible}
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
              rules={[
                { required: true, message: '請輸入股數' },
                {
                  type: 'number',
                  min: 0.0001,
                  message: '請勿輸入小於0股數',
                },
              ]}
            >
              <InputNumber autoFocus size="large" step={0.0001} min={0.0001} />
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
