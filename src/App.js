import React, { useEffect } from 'react';
import { Router, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
// Page
import StockPage from 'pages/StockPage.js';
import PortfolioPage from 'pages/PortfolioPage.js';
import ChartPage from 'pages/ChartPage.js';
import RebalancePage from 'pages/RebalancePage';
import DonatePage from 'pages/DonatePage.js';

import NavBar from 'components/common/NavBar';
const history = createBrowserHistory();

const routes = [
  {
    path: '/portfolio',
    component: PortfolioPage,
  },
  {
    path: '/list',
    component: StockPage,
  },
  {
    path: '/chart',
    component: ChartPage,
  },
  {
    path: '/donate',
    component: DonatePage,
  },
  {
    path: '/rebalance',
    component: RebalancePage,
  },
];

const App = () => {
  useEffect(() => {
    history.push('/portfolio');
  }, []);

  return (
    <Router history={history}>
      <div className="header">
        <NavBar history={history} />
      </div>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} component={route.component} />
      ))}
    </Router>
  );
};

export default App;
