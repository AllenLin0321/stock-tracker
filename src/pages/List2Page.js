import React from "react";
import SearchBar from "components/list/SearchBar";
import Record from "components/list/Record";

const List2Page = () => {
  return (
    <div>
      <SearchBar page="2" />
      <Record page="2" />
    </div>
  );
};

export default List2Page;
