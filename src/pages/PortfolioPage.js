import React from "react";
import SearchBar from "components/list/SearchBar";
import { PieChart } from "bizcharts";

const data = [
  {
    type: "VTI",
    value: 60,
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
        <PieChart
          data={data}
          title={{
            visible: true,
            text: "饼图-外部图形标签(outer label)",
          }}
          description={{
            visible: true,
            text:
              "当把饼图label的类型设置为outer时，标签在切片外部拉线显示。设置offset控制标签的偏移值。",
          }}
          radius={0.8}
          angleField="value"
          colorField="type"
          label={{
            visible: true,
            type: "outer",
            offset: 20,
          }}
        />
      </div>
    );
  }
}

export default Portfolio;
