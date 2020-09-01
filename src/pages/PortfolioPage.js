import React from "react";
import SearchBar from "components/list/SearchBar";
import { PieChart } from "bizcharts";

const data = [
  {
    type: "分类一",
    value: 27,
  },
  {
    type: "分类二",
    value: 25,
  },
  {
    type: "分类三",
    value: 18,
  },
  {
    type: "分类四",
    value: 15,
  },
  {
    type: "分类五",
    value: 10,
  },
  {
    type: "其它",
    value: 5,
  },
];

class Portfolio extends React.Component {
  render() {
    return (
      <div>
        <SearchBar page="2" />
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
