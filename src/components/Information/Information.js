import React from "react";
import classes from "./Information.module.css";

import info from "./../../images/streamline-icon-information-1@48x48.png";
import crystal from "./../../images/streamline-icon-u+2744@250x250.png";
import cloud from "./../../images/streamline-icon-u+2601@250x250.png";
import snow_cloud from "./../../images/streamline-icon-u+1f328@250x250.png";

export const Information = () => {
  return (
    <>
      <img src={info} className={classes.information} />
      <div className={classes.blockToShow}>
        <div>
          2 x
          <img src={crystal} className={classes.item} />+
          <img src={cloud} className={classes.item} />=
          <img src={snow_cloud} className={classes.item} />
        </div>
      </div>
    </>
  );
};
