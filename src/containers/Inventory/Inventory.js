import React from "react";
import classes from "./Inventory.module.css";
import { Item } from "./../../components/Item/Item";
import { useInventory } from "../../context/inventory";

export const Inventory = () => {
  const {
    items,
    setItems,
    table,
    takeItem,
    putItem,
    activeItem,
    stackItem,
    swapItem,
    hasActiveItem,
    hasReceipt,
  } = useInventory();

  console.log(activeItem);

  const rows = [];
  for (let row = 0; row < table.row; row++) {
    const cells = [];
    for (let column = 0; column < table.column; column++) {
      const currentPosition = `${row}-${column}`;
      const item = items.find(
        (currentItem) => currentItem.position === currentPosition
      );
      cells.push(
        <th
          key={currentPosition}
          onClick={(e) => {
            if (item) {
              if (hasActiveItem) {
                if (item.id === activeItem.id) {
                  console.log("stack");
                  stackItem(item);
                } else {
                  console.log("swap");
                  hasReceipt(item, currentPosition);
                }
              } else {
                takeItem(e, item);
              }
            } else {
              if (!hasActiveItem) return;
              putItem(currentPosition);
            }
          }}
          onContextMenu={(e) => {
            if (item) takeItem(e, item);
          }}
        >
          {item && <Item item={item} />}
        </th>
      );
    }
    rows.push(
      <tr key={row} id={row}>
        {cells}
      </tr>
    );
  }
  return (
    <table
      onClick={(e) => e.stopPropagation()}
      className={classes.inventory}
      id="simple-board"
    >
      <tbody>{rows}</tbody>
    </table>
  );
};
