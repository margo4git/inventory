import React, { useCallback, useContext, useEffect, useState } from "react";
import { Item } from "../../components/Item/Item";
import { useInventory } from "../../context/inventory";

export const ActiveItem = () => {
  const [mousePosition, setMousePosition] = useState({ mouseX: 0, mouseY: 0 });
  const { activeItem } = useInventory();
  const widthItem = 75;
  const heightItem = 75;

  useEffect(() => {
    document.addEventListener("mousemove", (e) => {
      setMousePosition({ mouseX: e.clientX, mouseY: e.clientY });
    });
  }, []);

  return (
    <>
      {activeItem.id ? (
        <Item
          item={activeItem}
          type="active"
          style={{
            top: mousePosition.mouseY - heightItem / 2,
            left: mousePosition.mouseX - widthItem / 2,
            position: "fixed",
            zIndex: 2,
            width: widthItem,
            height: heightItem,
          }}
        />
      ) : null}
    </>
  );
};
