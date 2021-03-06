import React, { useState, useLayoutEffect } from 'react';

// REDUX
import { useDispatch, useSelector } from 'react-redux';
import {
  onChangeStockQuantity,
  onRemovePortfolio,
  onChangeOrder,
} from 'redux/slice/portfolioSlice';

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
  TransactionOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import arrayMove from 'array-move';
import {
  getStockPercent,
  numberToCurrency,
  getStockChangePercent,
} from 'utils';
import { apiGetCurrency } from 'api';

import DetailDrawer from 'components/common/DetailDrawer';

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

const Record = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStock, setSelectedStock] = useState();
  const [currency, setCurrency] = useState(CURRENCY.USD);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isTransferLoading, setIsTransferLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showExchangeRate, setShowExchangeRate] = useState(false);
  const dispatch = useDispatch();
  const portfolio = useSelector(state => state.portfolio.stocks);
  const tableLoading = useSelector(state => state.loading.tableLoading);

  useLayoutEffect(() => {
    const onUpdateCurrency = async () => {
      if (currency === CURRENCY.TWD) {
        try {
          setIsTransferLoading(true);
          const { data } = await apiGetCurrency();
          setExchangeRate(data.quotes.USDTWD);
          setShowExchangeRate(true);
        } catch (error) {
          error.response && message.error(error.response.data);
        } finally {
          setIsTransferLoading(false);
        }
      } else {
        setShowExchangeRate(false);
      }
    };
    onUpdateCurrency();
  }, [currency]);

  const columns = [
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
      title: <FormattedMessage id="record.quantity" />,
      key: 'quantity',
      render: rowData => {
        return (
          <Link
            onClick={() => {
              setModalVisible(true);
              setSelectedStock(rowData);
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
        const displayColor = isRise
          ? 'green'
          : changePercent === 0
          ? 'lightgray'
          : 'red';

        return (
          <div>
            <div style={{ color: displayColor }}>
              {isRise && '+'}
              {change}
            </div>
            <Tag
              color={displayColor}
              icon={
                isRise ? (
                  <RiseOutlined />
                ) : changePercent === 0 ? null : (
                  <FallOutlined />
                )
              }
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
              dispatch(onRemovePortfolio(rowData));
            }}
          />
        );
      },
    },
  ];

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newStockArr = arrayMove(
        [].concat(portfolio),
        oldIndex,
        newIndex
      ).filter(el => !!el);
      dispatch(onChangeOrder(newStockArr));
    }
  };

  const onModalFormSubmit = ({ quantity }) => {
    onQuantityChange(selectedStock, quantity);
    setModalVisible(false);
    setSelectedStock(null);
  };

  const onQuantityChange = (rowData, newQuantity) => {
    dispatch(
      onChangeStockQuantity({
        symbol: rowData.symbol,
        quantity: newQuantity,
      })
    );
  };

  const renderStatisticTitle = () => {
    const transferIconConfig = {
      onClick: () => {
        setCurrency(currency === CURRENCY.USD ? CURRENCY.TWD : CURRENCY.USD);
      },
    };

    return (
      <Text>
        總資產{' '}
        <Space>
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

  const renderTableFooter = () => {
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
          title={renderStatisticTitle()}
          value={`${currencySymbol}${numberToCurrency({
            num: totalValue,
          })}`}
        />
        {
          <Text style={{ color: totalValueChange > 0 ? '#3f8600' : '#cf1322' }}>
            {totalValueChange > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {currencySymbol +
              numberToCurrency({
                num: totalValueChange,
              })}{' '}
            ({totalChange.toFixed(2)}%)
          </Text>
        }
      </span>
    );
  };

  const DraggableContainer = props => (
    <SortableContainer
      {...props}
      useDragHandle
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = portfolio.findIndex(
      x => x.symbol === restProps['data-row-key']
    );
    return <SortableItem index={index} {...restProps} />;
  };

  if (portfolio?.length === 0) return <Empty />;

  return (
    <>
      <Table
        pagination={false}
        dataSource={portfolio}
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
        footer={() => renderTableFooter()}
      />
      <DetailDrawer
        selectedStock={selectedStock}
        drawerVisible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
        }}
      />
      <Modal
        destroyOnClose
        centered
        footer={null}
        title={selectedStock ? selectedStock.symbol : ''}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onModalFormSubmit}
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
};

export default Record;
