import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import poo from "./../images/streamline-icon-u+1f4a9@250x250.png";
import crystal from "./../images/streamline-icon-u+2744@250x250.png";
import cloud from "./../images/streamline-icon-u+2601@250x250.png";
import snow_cloud from "./../images/streamline-icon-u+1f328@250x250.png";
import { debounce, throttle } from "lodash";

export const InventoryContext = createContext();

const useData = () => {
  // initial states
  const initialStateItems = useMemo(
    () => [
      {
        position: "0-0",
        image: poo,
        amount: 5,
        id: "poo",
        message: "Throw me away!",
        sound:
          "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
      },
      { position: "0-1", image: crystal, amount: 2, id: "crystal" },
      {
        position: "0-2",
        image: cloud,
        amount: 4,
        id: "cloud",
        message: "Combine me, please!",
      },
      { position: "0-3", image: snow_cloud, amount: 3, id: "snow-cloud" },
    ],
    []
  );
  const initialStateTable = useMemo(() => ({ row: 3, column: 4 }), []);

  const receiptSnowCloud = {
    id: "snow-cloud",
    image: snow_cloud,
    amountCrystal: 2,
    amountSnowCloud: 1,
    amount: 1,
    type() {
      return `${this.amountCrystal}crystal-${this.amountSnowCloud}cloud`;
    },
  };

  const receipts = [
    {
      id: "snow-cloud",
      image: snow_cloud,
      amountCrystal: 2,
      amountSnowCloud: 1,
      amount: 1,
      type: function () {
        return `${this.amountCrystal}crystal-${this.amountSnowCloud}cloud`;
      },
    },
    {
      m: 0,
      type() {
        return "8";
      },
    },
  ];

  // states
  const [items, setItems] = useState(initialStateItems);
  const [table, setTable] = useState(initialStateTable);
  const [activeItem, setActiveItem] = useState({});

  // functions
  const refreshInventory = useCallback(() => {
    setTable(initialStateTable);
    setItems(initialStateItems);
  }, []);

  const expandInventory = useCallback(() => {
    setTable((prevTable) => {
      return { ...prevTable, row: prevTable.row + 1 };
    });
  }, []);

  const reduceInvetory = useCallback(() => {
    setTable((prevTable) => {
      if (prevTable.row > initialStateTable.row) {
        const currentPosition = `${prevTable.row - 1}`;

        setItems((prevItems) => {
          return prevItems.filter(({ position }) => {
            return !position.startsWith(currentPosition);
          });
        });
        return { ...prevTable, row: prevTable.row - 1 };
      }
      return prevTable;
    });
  }, []);

  const removeItem = useCallback((item) => {
    setItems((prevItems) => {
      return prevItems.filter(({ position }) => position !== item.position);
    });
  }, []);
  const changeAmout = useCallback((item, change) => {
    setItems((prevItems) => {
      return prevItems.reduce((inv, it) => {
        if (it.position === item.position) {
          return [...inv, { ...it, amount: it.amount + change }];
        } else {
          return [...inv, it];
        }
      }, []);
    });
  }, []);
  const takeItem = useCallback(
    (e, item = {}) => {
      console.log(e.type);
      e.preventDefault();
      if (e.button == 0) {
        setActiveItem({ ...item });
        removeItem(item);
      }
      if (e.button == 2) {
        if (activeItem.position) {
          if (activeItem.id === item.id) {
            setActiveItem((prevActiveItem) => {
              return { ...activeItem, amount: prevActiveItem.amount + 1 };
            });
            changeAmout(item, -1);
            if (item.amount === 1) {
              removeItem(item);
            }
          }
        } else {
          setActiveItem({ ...item, amount: 1 });
          if (item.amount === 1) {
            removeItem(item);
          }
          changeAmout(item, -1);
        }
      }
    },
    [activeItem]
  );

  const putItem = useCallback(
    (currentPosition) => {
      setItems((prevItems) => {
        return [...prevItems, { ...activeItem, position: currentPosition }];
      });
      setActiveItem({});
    },
    [activeItem]
  );
  const stackItem = useCallback(
    (item = {}) => {
      console.log("STACK", item);
      changeAmout(item, activeItem.amount);

      setActiveItem({});
    },
    [activeItem]
  );

  const findReceipt = useCallback(
    (combination = {}) => {
      return receipts.reduce((receipt, nowReceipt) => {
        if (
          nowReceipt.type() === combination.first ||
          nowReceipt.type() === combination.second
        ) {
          receipt = nowReceipt;
          return receipt;
        } else return receipt;
      }, 0);
    },
    [receipts]
  );

  const hasReceipt = useCallback(
    (item = {}, currentPosition) => {
      const combination = {
        first: `${item.amount}${item.id}-${activeItem.amount}${activeItem.id}`,
        second: `${activeItem.amount}${activeItem.id}-${item.amount}${item.id}`,
      };
      if (findReceipt(combination)) {
        applyReceipt(item, findReceipt(combination));
      } else swapItem(item, currentPosition);
    },
    [receiptSnowCloud]
  );

  const applyReceipt = useCallback((item = {}, receipt) => {
    const newPosition = item.position;
    removeItem({ ...item });
    setItems((prevItems) => {
      return [...prevItems, { ...receipt, position: newPosition }];
    });
    setActiveItem({});
  }, []);

  const swapItem = useCallback(
    (item = {}, currentPosition) => {
      const newActiveItem = { ...item };
      removeItem(item);
      putItem(currentPosition);
      setActiveItem(newActiveItem);
    },
    [activeItem]
  );
  const deleteItem = useCallback(() => {
    if (activeItem.position) {
      setActiveItem({});
    }
  }, [activeItem]);

  // memos
  const hasActiveItem = useMemo(
    () => Boolean(activeItem.position),
    [activeItem]
  );

  return {
    items,
    setItems,
    table,
    setTable,
    refreshInventory,
    expandInventory,
    reduceInvetory,
    takeItem,
    activeItem,
    putItem,
    stackItem,
    swapItem,
    deleteItem,
    hasActiveItem,
    hasReceipt,
  };
};

export const InventoryProvider = ({ children }) => {
  const data = useData();

  return (
    <InventoryContext.Provider value={data}>
      {children}
    </InventoryContext.Provider>
  );
};
export const InvetoryConsumer = InventoryContext.Consumer;
export const useInventory = () => useContext(InventoryContext);
