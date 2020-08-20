import React from "react";
import SearchBar from "components/SearchBar";
import SortableTable from "components/Record";
import NavBar from "components/NavBar";
import Attribution from "components/Attribution";

class App extends React.Component {
  render() {
    return (
      <>
        <SearchBar />
        <SortableTable />
        <NavBar />
        <Attribution />
      </>
    );
  }
}

export default App;
