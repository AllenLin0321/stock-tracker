import React from "react";
import SearchBar from "components/SearchBar";
import Record from "components/Record";

const List1Page = () => {
  return (
    <div>
      <SearchBar page="1" />
      <Record page="1" />
    </div>
  );
};

export default List1Page;
