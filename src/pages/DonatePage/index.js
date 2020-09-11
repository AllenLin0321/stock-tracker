import React from 'react';
import { Space, Modal, Image, Divider } from 'antd';

import KoFi from 'components/common/KOFI';
import Attribution from 'components/common/Attribution';
import jkos_logo from 'assets/jkos_logo.png';
import jkos_QR from 'assets/jkos_QR.jpg';
import linePay_logo from 'assets/linePay_logo.jpg';
import linePay_QR from 'assets/linePay_QR.jpg';

import 'pages/DonatePage/index.scss';

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

class DonatePage extends React.Component {
  state = {
    modalVisible: false,
    selectedPaymentGateway: 'jkos',
  };

  getLogoProps = type => ({
    width: 60,
    style: { cursor: 'pointer' },
    src: paymentGateway[type].logo,
  });

  renderTopSide = () => {
    return (
      <div className="donate-content__wrapper">
        若您喜歡這個小工具，歡迎給我們評分以及建議
        <br />
        若有幫助到您，您的贊助是我們前進的動力
        <Divider />
        您可以幫我買杯咖啡提神😁
        <br />
        也可選擇使用「街口支付」或「LINE Pay」
      </div>
    );
  };

  renderBottomtSide = () => {
    return (
      <>
        <KoFi color="#29abe0" id="S6S022GTJ" label="請喝一杯咖啡" />
        <span>
          <Space size="middle">
            <img
              {...this.getLogoProps('jkos')}
              alt="jkos_logo"
              onClick={() => {
                this.setState({
                  modalVisible: true,
                  selectedPaymentGateway: 'jkos',
                });
              }}
            />

            <img
              {...this.getLogoProps('linePay')}
              alt="linePay_logo"
              onClick={() => {
                this.setState({
                  modalVisible: true,
                  selectedPaymentGateway: 'linePay',
                });
              }}
            />
          </Space>
        </span>
      </>
    );
  };

  render() {
    return (
      <div className="donate__wrapper">
        <Space direction="vertical" size="middle">
          {this.renderTopSide()}
          {this.renderBottomtSide()}
        </Space>
        <Attribution />
        <Modal
          width={200}
          visible={this.state.modalVisible}
          title={paymentGateway[this.state.selectedPaymentGateway].title}
          footer={null}
          onCancel={() =>
            this.setState({
              modalVisible: false,
              selectedPaymentGateway: 'jkos',
            })
          }
        >
          <Image
            src={paymentGateway[this.state.selectedPaymentGateway].qrCode}
          ></Image>
        </Modal>
      </div>
    );
  }
}

export default DonatePage;
