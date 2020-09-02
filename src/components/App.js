import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { apiGetStock } from 'api';
import { getStoreData } from 'utils';

import * as actions from 'actions';
import ListPage from 'pages/ListPage';
import PortfolioPage from 'pages/PortfolioPage';
import RebalancePage from 'pages/RebalancePage';
import DonatePage from 'pages/DonatePage';
import NavBar from 'components/common/NavBar';
import history from 'history.js';

import 'components/App.scss';

class App extends React.Component {
  state = { firstReload: true };

  componentDidMount() {
    history.push('/portfolio');
    const savedStock = localStorage.getItem('stocks');
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedStock) {
      this.props.initialStock(JSON.parse(savedStock));
    }
    if (savedPortfolio) {
      this.props.initialPortfolio(JSON.parse(savedPortfolio));
    }
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
          <Route path="/portfolio" exact component={PortfolioPage} />
          <Route path="/list" exact component={ListPage} />
          <Route path="/donate" component={DonatePage} />
          <Route path="/rebalance" component={RebalancePage} />
          <div className="footer">
            <NavBar history={history} />
          </div>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { stocks: state.stocks };
};

export default connect(mapStateToProps, actions)(App);
