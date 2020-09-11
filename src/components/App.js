import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from 'store/actions';

// Page
import ListPage from 'pages/ListPage';
import PortfolioPage from 'pages/PortfolioPage';
import ChartPage from 'pages/ChartPage';
import RebalancePage from 'pages/RebalancePage';
import DonatePage from 'pages/DonatePage';

import NavBar from 'components/common/NavBar';
import history from 'history.js';

import 'components/App.scss';

class App extends React.Component {
  componentDidMount() {
    history.push('/list');
  }

  render() {
    return (
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
    );
  }
}

const mapStateToProps = state => {
  return { stocks: state.stocks };
};

export default connect(mapStateToProps, actions)(App);
