import React, { useCallback, useEffect, useRef, useState } from "react";
import classes from "./Item.module.css";

export const Item = ({
  item: { image = "", amount = 0, id = "", message = "" } = {},
  ...props
}) => {
  const [messageDisplayed, setMessageDisplay] = useState(false);
  const messageTimerRef = useRef(null);

  const setMessageTimer = useCallback(() => {
    messageTimerRef.current = setTimeout(() => {
      setMessageDisplay(true);
    }, Math.floor(Math.random() * (6 - 3 + 1) + 3) * 1000);
  }, [messageTimerRef]);

  const clearMessageTimer = useCallback(() => {
    clearTimeout(messageTimerRef.current);
  }, [messageTimerRef]);

  useEffect(() => {
    setMessageTimer();

    return () => {
      clearMessageTimer();
    };
  }, []);

  useEffect(() => {
    clearMessageTimer();
    setMessageDisplay(false);
    setMessageTimer();
  }, [amount]);

  return (
    <div className={classes.column}>
      {message && (
        <p
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={[
            classes.bubble,
            messageDisplayed ? classes.bubbleVisible : classes.messageHidden,
          ].join(" ")}
        >
          {message}
        </p>
      )}
      <div className={classes.item} {...props}>
        <img src={image} alt={id} className={classes.image} />
        <span className={classes.amount}>{amount}</span>
      </div>
    </div>
  );
};
