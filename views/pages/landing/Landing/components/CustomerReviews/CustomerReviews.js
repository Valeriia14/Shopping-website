import { Box, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import ReviewListing from "./ReviewListing";
import { usePageData } from "@ktwebsite/hooks";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: "174px 0px 175px",
    backgroundColor: "#f9f8f4",
    [theme.breakpoints.down("xs")]: {
      padding: "52px 0px 52px",
    },
  },
  topicBox: {
    borderTop: "6px solid #000000",
    borderBottom: "2px solid #000000",
    height: "fit-content",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
      marginRight: 0,
    },
  },
  title: {
    fontFamily: "Cormorant-SemiBold",
    fontSize: "40px",
    fontWeight: 600,
    lineHeight: "48px",
    textAlign: "center",
    margin: "31px 0px 32px",
    textTransform: "capitalize",
    [theme.breakpoints.down("xs")]: {
      fontSize: 24,
      lineHeight: "39px",
      margin: "25px 0px 23px",
    },
  },
}));

const CustomerReviews = () => {
  const classes = useStyles();
  const reviews = usePageData((data) => data.customer_reviews);
  return (
    <Box className={classes.root}>
      <Box className={classes.topicBox}>
        <Typography className={classes.title}>Customer Reviews</Typography>
      </Box>
      <ReviewListing reviews={reviews}/>
    </Box>
  );
};

export default CustomerReviews;
