import { Box, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import CheckOutBody from "./Components/CheckOutBody";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "80px 0px",
    [theme.breakpoints.down("xs")]: {
      padding: "50px 0px",
    },
  },
}));

export default (props: any) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <CheckOutBody />
    </Box>
  );
};
