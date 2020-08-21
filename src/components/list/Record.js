import React from "react";
import { connect } from "react-redux";
import { Table, Button, Tag } from "antd";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { MenuOutlined } from "@ant-design/icons";
import arrayMove from "array-move";
import * as actions from "actions";
import "components/list/Record.scss";
import { DeleteOutlined, RiseOutlined, FallOutlined } from "@ant-design/icons";
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
        key: "change",
        render: text => {
          const changePercent = (text.change / text.previousClose) * 100;
          const isRise = changePercent > 0;
          return (
            <div>
              <div style={{ color: isRise ? "green" : "red" }}>
                {isRise && "+"}
                {text.change}
              </div>
              <Tag
                color={isRise ? "green" : "red"}
                icon={isRise ? <RiseOutlined /> : <FallOutlined />}
              >
                {isRise && "+"}
                {changePercent.toFixed(2)}%
              </Tag>
            </div>
          );
        },
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
        title: "Updated Time",
        dataIndex: "updatedTime",
      },
      {
        title: "Action",
        key: "action",
        render: text => {
          return (
            <Button
              type="danger"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => {
                this.props.removeStock({
                  newStockArr: text,
                  page: this.props.page,
                });
              }}
            />
          );
        },
      },
    ],
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { stocks, page } = this.props;
    if (oldIndex !== newIndex) {
      const newStockArr = arrayMove(
        [].concat(stocks),
        oldIndex,
        newIndex
      ).filter(el => !!el);
      this.props.changeStockOrder({ newStockArr, page });
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
        scroll={{ y: 200 }}
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

const mapStateToProps = (state, ownProps) => {
  return { stocks: state.stocks[ownProps.page] };
};

export default connect(mapStateToProps, actions)(Record);
