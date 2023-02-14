import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import ProductListing from "./ProductListing";
import { usePageData } from "@ktwebsite/hooks";

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    fontFamily: "Cormorant-SemiBold",
    fontSize: "40px",
    fontWeight: 600,
    lineHeight: "48px",
    textAlign: "center",
    margin: "165px 0px 50px",
    textTransform: "capitalize",
    [theme.breakpoints.down("xs")]: {
      fontSize: 24,
      lineHeight: "39px",
      margin: "45px 0px 30px",
    },
  },
}));

const Accessory = () => {
  const classes = useStyles();
  const accessory = usePageData((data) => data.accessory);
  const { name, accessories } = accessory;
  return (
    <Fragment>
      {accessories?.length > 0 && (
        <Box className={classes.root}>
          <Typography className={classes.title}> {name} </Typography>
          <ProductListing products={accessories} />
        </Box>
      )}
    </Fragment>
  );
};

export default Accessory;
