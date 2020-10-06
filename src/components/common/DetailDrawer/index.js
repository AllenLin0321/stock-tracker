﻿import React from 'react';
import { Tag, Drawer, Space, Slider, Row, Typography } from 'antd';
import { numberToCurrency } from 'utils';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
const { Text, Title } = Typography;
class DetailDrawer extends React.Component {
  renderDrawerTitle = () => {
    const { symbol, companyName } = this.props.selectedStock;
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
    const { selectedStock } = this.props;
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

    const change = parseFloat(
      (selectedStock.latestPrice - selectedStock.previousClose).toFixed(2)
    );

    const changePercent = (change / selectedStock.previousClose) * 100;
    const isRise = changePercent > 0;
    const renderChange = () => (
      <Space>
        <span style={{ color: isRise ? 'green' : 'red' }}>
          {isRise && '+'}
          {numberToCurrency({ num: change })}
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

    return (
      <Drawer
        destroyOnClose
        title={this.renderDrawerTitle()}
        closable={false}
        onClose={() => this.props.onClose()}
        visible={this.props.drawerVisible}
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
  render() {
    return this.renderDrawer();
  }
}

export default DetailDrawer;
