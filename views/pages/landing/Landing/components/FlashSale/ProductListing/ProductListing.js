import { Box, Grid, Hidden } from "@material-ui/core";
import React, { Fragment } from "react";
import { usePageData } from "@ktwebsite/hooks";
import { useStyles } from "./styles";
import ProductItemBox from "../ProductItemBox";
import ProductItemBoxSmallScreen from "../ProductItemBoxSmallScreen";

const ProductListing = () => {
  const classes = useStyles();
  const data = usePageData();
  const { products_flash_promo_sale } = data;

  return (
    <Box className={classes.root}>
      <Hidden mdDown>
        {products_flash_promo_sale?.map((item, index) => {
          return (
            <Fragment key={index}>
              <ProductItemBox item={item} index={index} classes={classes} />
            </Fragment>
          );
        })}
      </Hidden>

      <Hidden xsDown lgUp>
        <Grid container>
          {products_flash_promo_sale?.map((item, index) => {
            return (
              <Fragment key={index}>
                <ProductItemBoxSmallScreen
                  item={item}
                  index={index}
                  classes={classes}
                />
              </Fragment>
            );
          })}
        </Grid>
      </Hidden>
    </Box>
  );
};

export default ProductListing;
