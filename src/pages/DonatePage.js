import React, { useState } from 'react';
import { Space, Modal, Image, Divider, Rate } from 'antd';
import styled from 'styled-components';
import KoFi from 'components/common/KOFI';
import Attribution from 'components/common/Attribution.js';
import jkos_logo from 'assets/jkos_logo.png';
import jkos_QR from 'assets/jkos_QR.jpg';
import linePay_logo from 'assets/linePay_logo.jpg';
import linePay_QR from 'assets/linePay_QR.jpg';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';

const paymentGateway = {
  jkos: {
    title: '街口支付',
    logo: jkos_logo,
    qrCode: jkos_QR,
  },
  linePay: {
    title: 'Line Pay',
    logo: linePay_logo,
    qrCode: linePay_QR,
  },
};

const tipsText = ['很不喜歡', '不喜歡', '普通', '喜歡', '超讚'];

const customIcons = {
  1: <FrownOutlined />,
  2: <FrownOutlined />,
  3: <MehOutlined />,
  4: <SmileOutlined />,
  5: <SmileOutlined />,
};

const DonateContent = styled.div`
  line-height: 25px;
`;

const rateUrl =
  'https://chrome.google.com/webstore/detail/us-stock-tracker/jjkiinjlfddnfbpmegolhhibgpcmmfdi?hl=zh-TW';

const DonatePage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState('jkos');

  const getLogoProps = type => ({
    width: 60,
    style: { cursor: 'pointer' },
    src: paymentGateway[type].logo,
  });

  const renderTopSide = () => {
    return (
      <DonateContent>
        若您喜歡這個小工具，歡迎給我們評分以及建議
        <span role="img" aria-label="clapping hands">
          👏
        </span>
        <br />
        <span>
          <Rate
            tooltips={tipsText}
            defaultValue={3}
            onChange={() => {
              window.open(rateUrl);
            }}
            character={({ index }) => {
              return customIcons[index + 1];
            }}
          />
        </span>
        <Divider />
        若有幫助到您，您的贊助是我們前進的動力
        <br />
        您可以幫我買杯咖啡提神{' '}
        <span role="img" aria-label="smile">
          😁
        </span>
        <br />
        也可選擇使用「街口支付」或「LINE Pay」
      </DonateContent>
    );
  };

  const renderBottomtSide = () => {
    return (
      <>
        <KoFi color="#29abe0" id="S6S022GTJ" label="請喝一杯咖啡" />
        <span>
          <Space size="middle">
            <img
              {...getLogoProps('jkos')}
              alt="jkos_logo"
              onClick={() => {
                setModalVisible(true);
                setSelectedPaymentGateway('jkos');
              }}
            />

            <img
              {...getLogoProps('linePay')}
              alt="linePay_logo"
              onClick={() => {
                setModalVisible(true);
                setSelectedPaymentGateway('linePay');
              }}
            />
          </Space>
        </span>
      </>
    );
  };

  return (
    <div className="donate__wrapper">
      <Space direction="vertical" size="middle">
        {renderTopSide()}
        {renderBottomtSide()}
      </Space>
      <Attribution />
      <Modal
        width={200}
        visible={modalVisible}
        title={paymentGateway[selectedPaymentGateway].title}
        footer={null}
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <Image src={paymentGateway[selectedPaymentGateway].qrCode}></Image>
      </Modal>
    </div>
  );
};

export default DonatePage;
