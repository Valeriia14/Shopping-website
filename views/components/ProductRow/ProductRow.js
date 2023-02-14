import { usePageData } from "@ktwebsite/hooks";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { Box, Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import ProductGalleryItem from "../ProductGalleryItem";
import ProductSquare from "../ProductSquare";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(0, -2),
    },
  },
  container: {
    width: "100%",
    padding: theme.spacing(1),
    overflow: "auto",
  },
  gallery: {
    fontSize: theme.spacing(8),
    height: "1em",
    whiteSpace: "nowrap",
  },
  item: {
    fontSize: "inherit",
    width: "1em",
    height: "1em",
    display: "inline-block",
    marginRight: theme.spacing(1),
  },
}));

const ProductRow = (props) => {
  const { className, character, products = [], activeProductId, ...rest } = props;
  const classes = useStyles();

  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      <Container className={classes.container} maxWidth="lg" disableGutters>
        <Box className={classes.gallery}>
          {products.map((product) => (
            <ProductGalleryItem
              onClick={() => doRedirect(`/products/${product.handle}`)}
              className={classes.item}
              key={product.id}
              src={product.preview?.uri}
              active={activeProductId === product.id} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ProductRow;
