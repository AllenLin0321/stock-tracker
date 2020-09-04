import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { apiGetStock } from 'api';
import { getStoreData } from 'utils';

import * as actions from 'actions';
import ListPage from 'pages/ListPage';
import PortfolioPage from 'pages/PortfolioPage';
import ChartPage from 'pages/ChartPage';
import RebalancePage from 'pages/RebalancePage';
import DonatePage from 'pages/DonatePage';
import NavBar from 'components/common/NavBar';
import history from 'history.js';

import 'components/App.scss';

class App extends React.Component {
  state = { firstReload: true };

  componentDidMount() {
    history.push('/list');
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.firstReload &&
      prevProps.stocks.length !== this.props.stocks.length
    ) {
      this.reloadStocksPrice();
    }
  }

  reloadStocksPrice = async () => {
    const { stocks, onSaveStock, setTableLoading } = this.props;
    const delayIncrement = 250;
    let delay = 0;
    if (stocks.length === 0) return;
    let promiseArr = stocks.map(async stock => {
      delay += delayIncrement;
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiGetStock(stock.symbol);
    });
    try {
      setTableLoading({ tableLoading: true });
      const res = await Promise.all(promiseArr);
      res.forEach(({ data }) => {
        onSaveStock(getStoreData(data));
      });
    } catch (error) {
      console.log('error: ', error);
    } finally {
      this.setState({ firstReload: false });
      setTableLoading({ tableLoading: false });
    }
  };

  render() {
    return (
      <div>
        <Router history={history}>
          <div className="header">
            <NavBar history={history} />
          </div>
          <Route path="/portfolio" component={PortfolioPage} />
          <Route path="/list" component={ListPage} />
          <Route path="/chart" component={ChartPage} />
          <Route path="/donate" component={DonatePage} />
          <Route path="/rebalance" component={RebalancePage} />
        </Router>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { stocks: state.stocks };
};

export default connect(mapStateToProps, actions)(App);
