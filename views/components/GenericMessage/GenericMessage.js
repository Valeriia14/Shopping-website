import { Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    margin: theme.spacing(1, 0),
  },
  error: {
    color: theme.palette.error.main,
    fontSize: "13px",
    marginBottom: theme.spacing(0.5)
  },
  success: {
    color: theme.palette.success.main,
    fontSize: "13px",
  }
}));

const BaseButton = props => {
  const classes = useStyles();
  const { message, error, success, className } = props;

  return (
    <Box className={clsx(classes.root, className)}>
      {error && (<Typography className={classes.error}>{message}</Typography>)}
      {success && (<Typography className={classes.success}>{message}</Typography>)}
    </Box>
  );
};

export default BaseButton;