import React from 'react';
import { connect } from 'react-redux';
import { message, Radio } from 'antd';
import { Route, Switch } from 'react-router-dom';

import { apiGetStock } from 'api';
import * as actions from 'actions';
import { getPortfolioData } from 'utils';

import SearchBar from 'components/common/SearchBar';
import Record from 'components/portfolio/Record';
import Chart from 'components/portfolio/Chart';

import 'pages/PortfolioPage.scss';

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

  onDisplayChange = event => {
    const { value } = event.target;
    const { history, location } = this.props;
    history.push(`${location.pathname}/${value}`);
  };

  render() {
    return (
      <div>
        <SearchBar onClickSearch={this.onClickSearch} />
        <div className="portfolio_switch">
          <Radio.Group
            defaultValue="list"
            size="small"
            onChange={this.onDisplayChange}
          >
            <Radio.Button value="list">條列</Radio.Button>
            <Radio.Button value="chart">圖表</Radio.Button>
          </Radio.Group>
        </div>
        <Switch>
          <Route path="/portfolio/list">
            <Record />
          </Route>
          <Route path="/portfolio/chart">
            <Chart data={chartData} />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default connect(null, actions)(Portfolio);
