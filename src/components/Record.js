import React from "react";
import { connect } from "react-redux";
import { Table, Button } from "antd";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { MenuOutlined } from "@ant-design/icons";
import arrayMove from "array-move";
import * as actions from "actions";
import "components/Record.scss";

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: "pointer", color: "#999" }} />
));

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

class Record extends React.Component {
  state = {
    columns: [
      {
        title: "",
        dataIndex: "sort",
        width: 30,
        className: "drag-visible",
        render: () => <DragHandle />,
      },
      {
        title: "Name",
        dataIndex: "symbol",
        className: "drag-visible",
      },
      {
        title: "Latest Price",
        dataIndex: "latestPrice",
      },
      {
        title: "Change",
        dataIndex: "change",
      },
      {
        title: "High",
        dataIndex: "high",
      },
      {
        title: "Low",
        dataIndex: "low",
      },
      {
        title: "Action",
        key: "action",
        render: text => {
          return (
            <Button
              type="link"
              onClick={() => {
                this.props.removeStock(text);
              }}
            >
              Delete
            </Button>
          );
        },
      },
    ],
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { stocks } = this.props;
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(stocks), oldIndex, newIndex).filter(
        el => !!el
      );
      this.props.changeStockOrder(newData);
    }
  };

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { stocks } = this.props;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = stocks.findIndex(x => x.symbol === restProps["data-row-key"]);
    return <SortableItem index={index} {...restProps} />;
  };

  render() {
    const { stocks } = this.props;
    const DraggableContainer = props => (
      <SortableContainer
        useDragHandle
        helperClass="row-dragging"
        onSortEnd={this.onSortEnd}
        {...props}
      />
    );
    return (
      <Table
        pagination={false}
        dataSource={stocks}
        columns={this.state.columns}
        rowKey="symbol"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: this.DraggableBodyRow,
          },
        }}
      />
    );
  }
}

const mapStateToProps = state => {
  return { stocks: state.stocks };
};

export default connect(mapStateToProps, actions)(Record);
