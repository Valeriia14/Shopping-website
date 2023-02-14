import { Button, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";

const FancyButton = (props) => {
  const { children, className, loading, ...rest } = props;
  const classes = useStyles();

  return (
    <Button variant="contained" fullWidth {...rest} className={clsx(classes.root, className)}>
      {!!loading && (
        <span className={classes.spinnerContainer}>
          <CircularProgress className={classes.spinner} size="1em" color="inherit" />
        </span>
      )}
      {!loading && children}
    </Button>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    fontWeight: 900,
    color: "#fff",
    borderRadius: theme.spacing(1),
  },
  spinnerContainer: {
    fontSize: "1.75em",
    height: "1em",
  },
  spinner: {
    display: "block",
  },
}));

export default FancyButton;
