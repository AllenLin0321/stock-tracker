import React, { useEffect } from "react";
import { Router, Route } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "actions";
import List1Page from "pages/List1Page";
import List2Page from "pages/List2Page";
import RebalancePage from "pages/RebalancePage";
import DonatePage from "pages/DonatePage";
import NavBar from "components/common/NavBar";
import Attribution from "components/common/Attribution";
import history from "history.js";

const App = props => {
  useEffect(() => {
    history.push("/");
    const savedStock = localStorage.getItem("stocks");
    if (savedStock) {
      props.initialStock(JSON.parse(savedStock));
    }
  }, []);

  return (
    <div>
      <Router history={history}>
        <Route path="/" exact component={List1Page} />
        <Route path="/list2" exact component={List2Page} />
        <Route path="/donate" component={DonatePage} />
        <Route path="/rebalance" component={RebalancePage} />
        <NavBar history={history} />
        <Attribution />
      </Router>
    </div>
  );
};
export default connect(null, actions)(App);
