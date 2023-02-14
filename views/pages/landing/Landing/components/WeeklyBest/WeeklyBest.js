import { Box, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import ProductListing from "./ProductListing";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "172px 0px",
    [theme.breakpoints.down("xs")]: {
      padding: "51px 0px",
    },
  },
  container: {
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  topicBox: {
    width: "147px",
    borderTop: "3px solid",
    borderBottom: "3px solid",
    padding: "42px 0px",
    height: "fit-content",
    marginRight: 66,
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
      marginRight: 0,
      padding: "12px 0px",
    },
  },
  title: {
    fontFamily: "Cormorant-SemiBold",
    fontSize: "36px",
    fontWeight: 600,
    lineHeight: "36px",
    textAlign: "left",
    [theme.breakpoints.down("xs")]: {
      fontSize: 24,
      fontWeight: 700,
    },
  },
  text: {
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "18px",
    textAlign: "left",
    marginTop: 16,
    [theme.breakpoints.down("xs")]: {
      fontSize: 10,
      marginTop: 4,
    },
  },
}));

const WeeklyBest = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <Box className={classes.topicBox}>
          <Typography className={classes.title}>Weekly Best</Typography>
          <Typography className={classes.text}>FOR DECEMBER</Typography>
        </Box>
        <ProductListing />
      </Box>
    </Box>
  );
};

export default WeeklyBest;
