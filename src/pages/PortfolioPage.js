import React from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';

import { apiGetStock } from 'api';
import * as actions from 'actions';
import { getPortfolioData } from 'utils';

import SearchBar from 'components/common/SearchBar';
import Record from 'components/portfolio/Record';
import Chart from 'components/portfolio/Chart';

const chartData = [
  {
    type: 'VTI',
    value: 70,
  },
  {
    type: 'VXUS',
    value: 20,
  },
  {
    type: 'BND',
    value: 5,
  },
  {
    type: 'BNDW',
    value: 5,
  },
];

class Portfolio extends React.Component {
  onClickSearch = async symbol => {
    if (symbol === '') return;
    let res = { isSuccess: false };

    try {
      const { data } = await apiGetStock(symbol);

      if (data.quote) {
        this.props.onSavePortfolioStock(getPortfolioData(data));
      }
      res.isSuccess = true;
    } catch (error) {
      console.log('error: ', error);
      if (error.response) {
        message.error(error.response.data);
      }
    } finally {
      return res;
    }
  };

  render() {
    return (
      <div>
        <SearchBar onClickSearch={this.onClickSearch} />
        <Record />
        {this.props.portfolio.length !== 0 && <Chart data={chartData} />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { portfolio: state.portfolio };
};

export default connect(mapStateToProps, actions)(Portfolio);
