import { usePageData } from "@ktwebsite/hooks";
import { Box, Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import ProductSquare from "../ProductSquare";

const useStyles = makeStyles((theme) => ({
  root: {},
  product: {
    margin: theme.spacing(2, 0),
    [theme.breakpoints.down("sm")]: {
      margin: 0,
    },
  },
}));

const ProductListing = (props) => {
  const { className, character, products: overrideProducts, ...rest } = props;
  const products = usePageData(data => data.products ?? []);
  const classes = useStyles();

  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {(overrideProducts ?? products).map(product => (
            <Grid key={product.id} xs={6} md={3} item>
              <ProductSquare className={classes.product} product={product} character={character} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductListing;
