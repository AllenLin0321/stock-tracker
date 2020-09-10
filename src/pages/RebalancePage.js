import React from 'react';
import { connect } from 'react-redux';
import { Switch, Form, InputNumber, Empty } from 'antd';

import { apiGetStock } from 'api';
import * as actions from 'actions';
import { getPortfolioData } from 'utils';
import Record from 'components/rebalance/Record';

import 'pages/RebalancePage.scss';
class RebalancePage extends React.Component {
  state = {
    isAddNewFund: false,
    newFund: 0,
    isExpandAll: false,
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
        let defaultPrecent = matchStock ? matchStock.defaultPrecent : null;
        onSavePortfolio(
          getPortfolioData({ ...data, quantity, defaultPrecent })
        );
      });
    } catch (error) {
      console.log('error: ', error);
    }
  };

  onSwitchChange = isAddNewFund => {
    this.setState({ isAddNewFund });
  };

  onisExpandAllChange = isExpandAll => {
    this.setState({ isExpandAll });
  };

  onInputNumberChange = newFund => {
    this.setState({ newFund });
  };

  render() {
    if (!this.props.portfolio || this.props.portfolio.length === 0) {
      return <Empty />;
    }

    return (
      <div className="rebalance__wrapper">
        <Form>
          <Form.Item label="是否再平衡" name="isAddNewFund">
            <Switch
              checked={this.state.isAddNewFund}
              onChange={this.onSwitchChange}
            />
          </Form.Item>
          {this.state.isAddNewFund && (
            <>
              <Form.Item label="注資金額" name="newFund">
                <InputNumber
                  defaultValue={0}
                  value={this.state.newFund}
                  formatter={value =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  onChange={this.onInputNumberChange}
                />
              </Form.Item>
              <Form.Item label="是否全部展開" name="isExpandAll">
                <Switch
                  checked={this.state.isExpandAll}
                  checkedChildren="展開"
                  unCheckedChildren="關閉"
                  onChange={this.onisExpandAllChange}
                />
              </Form.Item>
            </>
          )}
        </Form>
        <Record
          isAddNewFund={this.state.isAddNewFund}
          isExpandAll={this.state.isExpandAll}
          newFund={this.state.newFund}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { portfolio: state.portfolio };
};

export default connect(mapStateToProps, actions)(RebalancePage);
