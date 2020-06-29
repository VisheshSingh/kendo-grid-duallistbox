import React from "react";
import ReactDOM from "react-dom";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import products from "./products.json";

class App extends React.Component {
  lastSelectedIndex = 0;
  state = {
    data: products.map(dataItem =>
      Object.assign({ selected: false }, dataItem)
    ),
    deactivatedItems: products
      .map(dataItem => Object.assign({ selected: false }, dataItem))
      .filter(item => !item.isActive),
    activatedItems: products
      .map(dataItem => Object.assign({ selected: false }, dataItem))
      .filter(item => item.isActive)
  };

  selectionChange = event => {
    const data = this.state.data.map(item => {
      if (item.ProductID === event.dataItem.ProductID) {
        item.selected = !event.dataItem.selected;
      }
      return item;
    });
    this.setState({ data });
  };

  rowClick = (event, inputData) => {
    let last = this.lastSelectedIndex;
    const data = [...inputData];
    const current = data.findIndex(dataItem => dataItem === event.dataItem);

    if (!event.nativeEvent.shiftKey) {
      this.lastSelectedIndex = last = current;
    }

    if (!event.nativeEvent.ctrlKey) {
      data.forEach(item => (item.selected = false));
    }
    const select = !event.dataItem.selected;
    for (let i = Math.min(last, current); i <= Math.max(last, current); i++) {
      data[i].selected = select;
    }
    this.setState({ data });
  };

  headerSelectionChange = event => {
    const checked = event.syntheticEvent.target.checked;
    const data = this.state.data.map(item => {
      item.selected = checked;
      return item;
    });
    this.setState({ data });
  };

  moveAllRight = () => {
    this.setState({
      deactivatedItems: [],
      activatedItems: [
        ...this.state.deactivatedItems,
        ...this.state.activatedItems
      ]
    });
  };

  moveRight = () => {
    const selectedItems = this.state.deactivatedItems.filter(
      item => item.selected
    );
    const diffArr = this.state.deactivatedItems.filter(
      a => !selectedItems.map(b => b.selected).includes(a.selected)
    );
    this.setState({
      deactivatedItems: [...diffArr],
      activatedItems: [...selectedItems, ...this.state.activatedItems]
    });
  };

  moveLeft = () => {
    const selectedItems = this.state.activatedItems.filter(
      item => item.selected
    );
    const diffArr = this.state.activatedItems.filter(
      a => !selectedItems.map(b => b.selected).includes(a.selected)
    );
    this.setState({
      deactivatedItems: [...selectedItems, ...this.state.deactivatedItems],
      activatedItems: [...diffArr]
    });
  };

  moveAllLeft = () => {
    this.setState({
      activatedItems: [],
      deactivatedItems: [
        ...this.state.activatedItems,
        ...this.state.deactivatedItems
      ]
    });
  };

  render() {
    // console.log('what is data:', this.state)
    return (
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Grid
          data={this.state.deactivatedItems}
          selectedField="selected"
          onSelectionChange={this.selectionChange}
          onHeaderSelectionChange={this.headerSelectionChange}
          onRowClick={e => this.rowClick(e, this.state.deactivatedItems)}
        >
          {/* <Column
            field="selected"
            headerSelectionValue={
              this.state.data.findIndex(
                dataItem => dataItem.selected === false
              ) === -1
            }
          /> */}
          <Column field="ProductName" title="Deactivated Items" />
        </Grid>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <button onClick={this.moveAllRight}>⏭</button>
          <button onClick={this.moveRight}>▶</button>
          <button onClick={this.moveLeft}>◀</button>
          <button onClick={this.moveAllLeft}>⏮</button>
        </div>
        <Grid
          data={this.state.activatedItems}
          selectedField="selected"
          onSelectionChange={this.selectionChange}
          onHeaderSelectionChange={this.headerSelectionChange}
          onRowClick={e => this.rowClick(e, this.state.activatedItems)}
        >
          <Column field="ProductName" title="Activated Items" />
        </Grid>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
