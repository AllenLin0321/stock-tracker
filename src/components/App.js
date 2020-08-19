import React from "react";
import SearchBar from "components/SearchBar";
import SortableTable from "components/Record";
import Attribution from "components/Attribution";

class App extends React.Component {
  render() {
    return (
      <>
        <SearchBar />
        <SortableTable />
        <Attribution />
      </>
    );
  }
}

export default App;
