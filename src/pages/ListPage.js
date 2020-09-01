import React from "react";
import { connect } from "react-redux";
import { apiGetStock } from "api";
import * as actions from "actions";
import { message } from "antd";
import { getStoreData } from "utils";

import SearchBar from "components/common/SearchBar";
import Record from "components/list/Record";

class ListPage extends React.Component {
  onClickSearch = async symbol => {
    if (symbol === "") return;
    let res = { isSuccess: false };
    this.setState({ isSearchBtnLoading: true });

    try {
      const { data } = await apiGetStock(symbol);

      if (data.quote) {
        this.props.onSaveStock(getStoreData(data));
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
    const delayIncrement = 200;
    let delay = 0;

    if (stocks.length === 0) return;

    let promiseArr = stocks.map(async stock => {
      delay += delayIncrement;
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiGetStock(stock.symbol);
    });

    try {
      const res = await Promise.all(promiseArr);
      res.forEach(({ data }) => {
        onSaveStock(getStoreData(data));
      });
    } catch (error) {
      console.log("error: ", error);
    }
  };

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
