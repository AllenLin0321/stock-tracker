import React from 'react';
import { connect } from 'react-redux';
import { Switch, Form, InputNumber } from 'antd';

import Record from 'components/rebalance/Record';

import 'pages/RebalancePage.scss';
class RebalancePage extends React.Component {
  state = {
    isAddNewFund: true,
    newFund: 0,
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

export default connect(mapStateToProps)(RebalancePage);
