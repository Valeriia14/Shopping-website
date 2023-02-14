import { Box, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
  },
}));

const BaseLoader = props => {
  const classes = useStyles();
  const { color = "primary", size, className, margin = 3 } = props;

  return (
    <Box m={margin} className={clsx(classes.root, className)}>
      <CircularProgress color={color} size={size} />
    </Box>
  );
};

export default BaseLoader;