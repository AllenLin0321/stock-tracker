import React from "react";
import SearchBar from "components/SearchBar";
import Record from "components/Record";

const List2Page = () => {
  return (
    <div>
      <SearchBar page="2" />
      <Record page="2" />
    </div>
  );
};

export default List2Page;
