import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from 'store/actions';

// Page
import ListPage from 'pages/ListPage.js';
import PortfolioPage from 'pages/PortfolioPage.js';
import ChartPage from 'pages/ChartPage.js';
import RebalancePage from 'pages/RebalancePage';
import DonatePage from 'pages/DonatePage.js';

import NavBar from 'components/common/NavBar';
import history from 'history.js';

class App extends React.Component {
  componentDidMount() {
    history.push('/portfolio');
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
