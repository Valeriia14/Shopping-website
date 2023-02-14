import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    color: theme.palette.secondary.main,
    fontSize: "16px",
    fontWeight: 600,
    textAlign: "center",
    paddingTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  }
}));

const BundleAndSave = props => {
  const classes = useStyles();

  return (
    <Typography className={classes.root}>Bundle &amp; Save Up To 30%</Typography>
  );
};

export default BundleAndSave;
