import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { url } from "./IconData";
const useStyles = makeStyles((theme) => ({
  img: {
    width: "fit-content",
    height: "fit-content",
  },
}));
const IconComponent = (props) => {
  const classes = useStyles();
  return (
    <>
      <img
        className={clsx(props.className || classes.img)}
        src={`/${url[props?.name]}`}
        alt={props.name || ""}
      />
    </>
  );
};

export default IconComponent;
