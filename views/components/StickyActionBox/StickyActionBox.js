import { Box, makeStyles } from "@material-ui/core";
import React from "react";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    left: "0",
    width: "100vw",
    bottom: "0",
    display: "flex",
    padding: "16px 16px",
    position: "fixed",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#ffffff",
    boxShadow: "4px -2px 11px 0px #00000069"
  },
}));

const StickyActionBox = (props) => {
  const { className, children, zIndex } = props;
  const classes = useStyles();
  return (
    <Box zIndex={zIndex || 2} className={clsx(classes.root,className)}>
      {children}
    </Box>
  );
};

export default StickyActionBox;
