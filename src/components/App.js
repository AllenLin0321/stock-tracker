import React from "react";
import { Router, Route } from "react-router-dom";
import { connect } from "react-redux";
import { apiGetStock } from "api";
import moment from "moment";

import * as actions from "actions";
import List1Page from "pages/List1Page";
import PortfolioPage from "pages/PortfolioPage";
import RebalancePage from "pages/RebalancePage";
import DonatePage from "pages/DonatePage";
import NavBar from "components/common/NavBar";
import Attribution from "components/common/Attribution";
import history from "history.js";

const initialPage = 1;

class App extends React.Component {
  state = { firstReload: true };

  componentDidMount() {
    history.push("/list");
    const savedStock = localStorage.getItem("stocks");
    if (savedStock) {
      this.props.initialStock(JSON.parse(savedStock));
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.firstReload &&
      prevProps.stocks[initialPage].length !==
        this.props.stocks[initialPage].length
    ) {
      this.reloadStocksPrice();
    }
  }

  reloadStocksPrice = async () => {
    const { stocks, onSaveStock, setTableLoading } = this.props;
    const delayIncrement = 250;
    let delay = 0;

    if (stocks[initialPage].length === 0) return;

    let promiseArr = stocks[initialPage].map(async stock => {
      delay += delayIncrement;
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiGetStock(stock.symbol);
    });

    try {
      setTableLoading({ tableLoading: true });
      const res = await Promise.all(promiseArr);
      res.forEach(({ data }) => {
        onSaveStock(this.getStoreData(data));
      });
    } catch (error) {
      console.log("error: ", error);
    } finally {
      this.setState({ firstReload: false });
      setTableLoading({ tableLoading: false });
    }
  };

  getStoreData = data => ({
    ...data.quote,
    updatedTime: moment().format("HH:mm"),
    page: initialPage,
  });

  render() {
    return (
      <div>
        <Router history={history}>
          <Route path="/list" exact component={List1Page} />
          <Route path="/portfolio" exact component={PortfolioPage} />
          <Route path="/donate" component={DonatePage} />
          <Route path="/rebalance" component={RebalancePage} />
          <NavBar history={history} />
          <Attribution />
        </Router>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { stocks: state.stocks };
};

export default connect(mapStateToProps, actions)(App);
