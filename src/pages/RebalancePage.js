import React from 'react';
import { connect } from 'react-redux';
import { Switch, Form, InputNumber } from 'antd';

import { apiGetStock } from 'api';
import * as actions from 'actions';
import { getPortfolioData } from 'utils';
import Record from 'components/rebalance/Record';

import 'pages/RebalancePage.scss';
class RebalancePage extends React.Component {
  state = {
    isAddNewFund: false,
    newFund: 0,
  };

  async componentDidMount() {
    const savedPortfolio = localStorage.getItem('portfolio');

    if (savedPortfolio) {
      await this.props.initialPortfolio(JSON.parse(savedPortfolio));
      this.props.setTableLoading({ tableLoading: true });
      await this.onClickReload();
      this.props.setTableLoading({ tableLoading: false });
    }
  }

  onClickReload = async () => {
    const { portfolio, onSavePortfolio } = this.props;
    const delayIncrement = 200;
    let delay = 0;

    if (portfolio.length === 0) return;

    let promiseArr = portfolio.map(async stock => {
      delay += delayIncrement;
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiGetStock(stock.symbol);
    });

    try {
      const res = await Promise.all(promiseArr);
      res.forEach(({ data }) => {
        let matchStock = portfolio.find(
          stock => stock.symbol === data.quote.symbol
        );

        let quantity = matchStock ? matchStock.quantity : null;
        onSavePortfolio(getPortfolioData(data, quantity));
      });
    } catch (error) {
      console.log('error: ', error);
    }
  };

  onSwitchChange = isAddNewFund => {
    this.setState({ isAddNewFund });
  };

  onInputNumberChange = newFund => {
    this.setState({ newFund });
  };

  render() {
    return (
      <div className="rebalance__wrapper">
        <Form>
          <Form.Item label="是否注資" name="isAddNewFund">
            <Switch
              checked={this.state.isAddNewFund}
              onChange={this.onSwitchChange}
            />
          </Form.Item>
          <Form.Item label="注資金額" name="newFund">
            <InputNumber
              disabled={!this.state.isAddNewFund}
              value={this.state.newFund}
              formatter={value =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              onChange={this.onInputNumberChange}
            />
          </Form.Item>
        </Form>
        <Record />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { portfolio: state.portfolio };
};

export default connect(mapStateToProps, actions)(RebalancePage);
