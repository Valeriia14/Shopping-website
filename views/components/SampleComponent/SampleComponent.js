import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";

const SampleComponent = (props) => {
  const { children, className, ...rest } = props;
  const classes = useStyles();

  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      {children}
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default SampleComponent;
