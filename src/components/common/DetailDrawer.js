import React from 'react';
import { Tag, Drawer, Space, Slider, Row, Typography } from 'antd';
import { numberToCurrency } from 'utils';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
const { Text, Title } = Typography;

const DetailDrawer = props => {
  const renderDrawerTitle = () => {
    const { symbol, companyName } = props.selectedStock;
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

  const renderDrawer = () => {
    const { selectedStock } = props;
    if (!selectedStock) return false;

    const todayMarks = {
      [selectedStock.low]: {
        label: <Text type="secondary">{selectedStock.low}</Text>,
      },
      [selectedStock.latestPrice]: {
        label: '',
      },
      [selectedStock.high]: {
        label: <Text type="secondary">{selectedStock.high}</Text>,
      },
    };

    const week52Marks = {
      [selectedStock.week52Low]: {
        label: <Text type="secondary">{selectedStock.week52Low}</Text>,
      },
      [selectedStock.latestPrice]: {
        label: '',
      },
      [selectedStock.week52High]: {
        label: <Text type="secondary">{selectedStock.week52High}</Text>,
      },
    };

    const changePercent =
      (selectedStock.change / selectedStock.previousClose) * 100;
    const isRise = changePercent > 0;
    const renderChange = () => (
      <Space>
        <span style={{ color: isRise ? 'green' : 'red' }}>
          {isRise && '+'}
          {numberToCurrency({ num: selectedStock.change })}
        </span>
        <Tag
          color={isRise ? 'green' : 'red'}
          icon={isRise ? <RiseOutlined /> : <FallOutlined />}
        >
          {isRise && '+'}
          {changePercent.toFixed(2)}%
        </Tag>
      </Space>
    );

    const isExtendedRise = selectedStock.extendedChangePercent > 0;
    const renderExtendedChange = () => (
      <Space>
        <span style={{ color: isExtendedRise ? 'green' : 'red' }}>
          {isExtendedRise && '+'}
          {numberToCurrency({ num: selectedStock.extendedChange })}
        </span>
        <Tag
          color={isExtendedRise ? 'green' : 'red'}
          icon={isExtendedRise ? <RiseOutlined /> : <FallOutlined />}
        >
          {isExtendedRise && '+'}
          {(selectedStock.extendedChangePercent * 100).toFixed(2)}%
        </Tag>
      </Space>
    );

    return (
      <Drawer
        destroyOnClose
        title={renderDrawerTitle()}
        closable={false}
        onClose={() => props.onClose()}
        visible={props.drawerVisible}
      >
        <Row justify="center">
          <Title level={4}>
            {numberToCurrency({
              num: selectedStock.latestPrice,
              hasSymbol: true,
            })}
          </Title>
        </Row>
        <Row justify="center">
          <Title level={5}>{renderChange()}</Title>
        </Row>
        <Row justify="center">
          {selectedStock.extendedPrice && (
            <Text type="secondary">收盤價:{selectedStock.extendedPrice}</Text>
          )}
        </Row>
        {selectedStock.extendedPrice &&
          selectedStock.extendedPrice !== selectedStock.latestPrice && (
            <Row justify="center">
              <Title level={5}>{renderExtendedChange()}</Title>
            </Row>
          )}
        {selectedStock.low && selectedStock.high && (
          <>
            <Title level={5}>今日價格範圍</Title>
            <Slider
              disabled
              marks={todayMarks}
              included={false}
              step={0.01}
              defaultValue={selectedStock.latestPrice}
              min={selectedStock.low}
              max={selectedStock.high}
            />
          </>
        )}
        {selectedStock.week52Low && selectedStock.week52High && (
          <>
            <Title level={5}>52週價格範圍</Title>
            <Slider
              disabled
              marks={week52Marks}
              included={false}
              step={0.01}
              defaultValue={selectedStock.latestPrice}
              min={selectedStock.week52Low}
              max={selectedStock.week52High}
            />
          </>
        )}
      </Drawer>
    );
  };

  return renderDrawer();
};

export default DetailDrawer;
