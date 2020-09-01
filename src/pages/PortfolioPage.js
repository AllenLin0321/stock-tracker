import React from "react";
import SearchBar from "components/common/SearchBar";
import Chart from "components/portfolio/Chart";

const chartData = [
  {
    type: "VTI",
    value: 70,
  },
  {
    type: "VXUS",
    value: 20,
  },
  {
    type: "BND",
    value: 5,
  },
  {
    type: "BNDW",
    value: 5,
  },
];

class Portfolio extends React.Component {
  render() {
    return (
      <div>
        <SearchBar />
        <Chart data={chartData} />
      </div>
    );
  }
}

export default Portfolio;
