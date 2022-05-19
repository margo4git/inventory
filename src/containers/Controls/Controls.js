import React, { useContext } from "react";
import { Button } from "../../components/Button/Button";
import { useInventory } from "../../context/inventory";
import classes from "./Controls.module.css";

export const Controls = () => {
  const { expandInventory, reduceInvetory, refreshInventory } = useInventory();

  return (
    <div className={classes.controls}>
      <Button onClick={reduceInvetory} type="remove"></Button>
      <Button onClick={refreshInventory} type="again"></Button>
      <Button onClick={expandInventory} type="add"></Button>
    </div>
  );
};
