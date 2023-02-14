import {
    ElementDivider, NavBreadcrumbs, NotFoundPage,
    ProductContent, PageElements, AddReview, AddQuestion,
} from "@ktwebsite/components";
import { usePageData, usePageElements } from "@ktwebsite/hooks";
import { Box, Container, Grid, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React, { useState, useMemo } from "react";
import { ProductDescription, ProductGallery, ProductDetailTabView, ProductRecommends } from "./components";

const ProductDetail = (props) => {
  const { children, className, ...rest } = props;
  const product = usePageData((data) => data.product);
  const category= usePageData((data) => data.category);
  const classes = useStyles();
  const elements = usePageElements();
  const [ openReview, setOpenReview ] = useState(false);

  const webpageItems = category?.webpage?.items ?? [];

  const featuredCarousels = useMemo(()=>{
    return webpageItems?.filter((item)=>{
      return item.type === 'feature-carousel'
    })
  }, [ webpageItems ]);

  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      {product ? (
        <>
        <Box style={{borderBottom: '1px solid #000000', paddingBottom: '7px' }}>
          <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={12} md={6} className={classes.gallery}>
                  <NavBreadcrumbs
                    firstTitle="Home"
                    firstLink="/"
                    secondTitle="Products"
                    secondLink="/products"
                    finalTitle={product?.name}
                  />
                  <ProductGallery />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProductDescription />
            </Grid>
          </Grid>
          </Container>
        </Box>
        <Box>
          <Container maxWidth="lg">
            <Grid container spacing={2} justifyContent="space-between">
              <Grid item xs={12} md={12} id={"tab-section"}>
                <ProductDetailTabView />
              </Grid>
              <Grid item xs={12} md={12}>
                <ProductRecommends products={[product]}/>
              </Grid>
            </Grid>
          </Container>
        </Box>
        </>
      ) : (
        <Container maxWidth="lg">
          <NavBreadcrumbs
            firstTitle="Home"
            firstLink="/"
          />
          <NotFoundPage title="Oops! We cannot find this product." />
        </Container>
      )}
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1, 0),
  },
  gallery:{
    paddingTop: '45px !important',
    borderRight: '1px solid #000000',
    [theme.breakpoints.down('sm')]:{
      borderRight: 'none',
    }
  }
}));

export default ProductDetail;
