import logo from "./logo.svg";
import "./App.css";
import { Inventory } from "./containers/Inventory/Inventory";
import { useState } from "react";
import {
  InventoryProvider,
  InvetoryConsumer,
  useInventory,
} from "./context/inventory";
import { Controls } from "./containers/Controls/Controls";
import { Item } from "./components/Item/Item";
import { ActiveItem } from "./containers/ActiveItem/ActiveItem";
import { Information } from "./components/Information/Information";

function App() {
  return (
    <InventoryProvider>
      <InvetoryConsumer>
        {({ deleteItem }) => {
          return (
            <>
              <Information />
              <div onClick={deleteItem} className="allScreen">
                <ActiveItem />
                <div className="container">
                  <Controls />
                  <Inventory />
                </div>
              </div>
            </>
          );
        }}
      </InvetoryConsumer>
    </InventoryProvider>
  );
}

export default App;
