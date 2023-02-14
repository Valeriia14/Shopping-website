import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import PageElements from "../PageElements";

const Body = (props) => {
  const { children, className, ...rest } = props;
  const classes = useStyles();

  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      <PageElements position="before" />
      {children}
      <PageElements position="after" />
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default Body;
