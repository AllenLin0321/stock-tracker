import React from "react";
import { Router, Route } from "react-router-dom";

import List1Page from "pages/List1Page";
import List2Page from "pages/List2Page";
import DonatePage from "pages/DonatePage";
import NavBar from "components/NavBar";
import Attribution from "components/Attribution";
import history from "history.js";

const App = () => {
  return (
    <div>
      <Router history={history}>
        <Route path={["/", "/list1"]} exact component={List1Page} />
        <Route path="/list2" exact component={List2Page} />
        <Route path="/donate" component={DonatePage} />
        <NavBar history={history} />
        <Attribution />
      </Router>
    </div>
  );
};
export default App;
