import { usePageData } from "@ktwebsite/hooks";
import { Box, Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import ProductList from "./ProductList";
import Slider from "react-slick";

const useStyles = makeStyles((theme) => ({
  root: {},
  product: {
    margin: theme.spacing(2, 0),
    [theme.breakpoints.down("sm")]: {
      margin: 0,
    },
  },
  title: {
    fontSize: "20px",
    color: "#333333",
    lineHeight: "46px",
    fontWeight: "bold",
    paddingLeft: theme.spacing(10),
  },
}));

const ProductRecommends = (props) => {
  const { className, character, products: overrideProducts, ...rest } = props;
  const similarProducts = usePageData((data) => data.similar_products ?? []);
  const classes = useStyles();
  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      {/* <Grid container spacing={2}>
            <Grid key={"title"} xs={12} md={12} item>
              <Box display="flex" marginTop="100px" marginBottom="30px">
                <Typography className={classes.title}>YOU MAY LIKE THIS</Typography>
              </Box>
            </Grid>
            <Grid key={"title"} xs={12} md={12} item>
              <ProductList products={similarProducts.length && similarProducts || overrideProducts}/>
            </Grid>
        </Grid> */}
      <Box>
        <Box display="flex" marginTop="100px" marginBottom="30px">
          <Typography className={classes.title}>YOU MAY LIKE THIS</Typography>
        </Box>
        <ProductList
          products={
            (similarProducts.length && similarProducts) || overrideProducts
          }
        />
      </Box>
    </Box>
  );
};

export default ProductRecommends;
