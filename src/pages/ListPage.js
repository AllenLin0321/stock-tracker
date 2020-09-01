import React from "react";
import { connect } from "react-redux";
import { apiGetStock } from "api";
import * as actions from "actions";
import { message } from "antd";
import moment from "moment";

import SearchBar from "components/list/SearchBar";
import Record from "components/list/Record";

class ListPage extends React.Component {
  onClickSearch = async symbol => {
    if (symbol === "") return;
    let res = { isSuccess: false };
    this.setState({ isSearchBtnLoading: true });

    try {
      const { data } = await apiGetStock(symbol);

      if (data.quote) {
        this.props.onSaveStock(this.getStoreData(data));
      }
      res.isSuccess = true;
    } catch (error) {
      console.log("error: ", error);
      if (error.response) {
        message.error(error.response.data);
      }
    } finally {
      this.setState({ isSearchBtnLoading: false });
      return res;
    }
  };

  onClickReload = async () => {
    const { stocks, onSaveStock } = this.props;
    const page = 1;
    const delayIncrement = 200;
    let delay = 0;

    if (stocks[page].length === 0) return;

    let promiseArr = stocks[page].map(async stock => {
      delay += delayIncrement;
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiGetStock(stock.symbol);
    });

    try {
      const res = await Promise.all(promiseArr);
      res.forEach(({ data }) => {
        onSaveStock(this.getStoreData(data));
      });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  getStoreData = data => ({
    ...data.quote,
    updatedTime: moment().format("HH:mm"),
    page: "1",
  });

  render() {
    return (
      <div>
        <SearchBar
          page="1"
          onClickSearch={this.onClickSearch}
          onClickReload={this.onClickReload}
        />
        <Record page="1" />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { stocks: state.stocks };
};

export default connect(mapStateToProps, actions)(ListPage);
