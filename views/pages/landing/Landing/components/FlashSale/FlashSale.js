import { Box, Hidden, makeStyles } from "@material-ui/core";
import React from "react";
import { usePageData } from "@ktwebsite/hooks";
import ProductListing from "./ProductListing";
import TimeLeftBox from "./TimeLeftBox";
import TimeLeftBoxMobile from "./TimeLeftBoxMobile";
import ProductListingMobile from "./ProductListingMobile";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    [theme.breakpoints.down("xs")]: {
      flex: "nowrap",
      flexDirection: "column",
    }
  },
}));

const FlashSale = () => {
  const classes = useStyles();
  const data = usePageData();
  const { products_weekly_best } = data;
  return (
    <Box className={classes.root}>
      <Hidden xsDown>
        <TimeLeftBox />
        <ProductListing />
      </Hidden>
      <Hidden smUp>
        <TimeLeftBoxMobile />
        <ProductListingMobile />
      </Hidden>
    </Box>
  );
};

export default FlashSale;
