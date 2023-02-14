import { Box, Card, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useMemo } from "react";
import RatingStar from "../RatingStar";
import ProductImage from "../ProductImage";
import { CharacterIcon } from "./components";
import strings from "@ktwebsite/utils/strings";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    maxWidth: theme.spacing(32),
    width: "100%",
  },
  card: {
    borderRadius: theme.spacing(2),
    boxShadow: "0 2px 29px rgba(0,0,0,.2)",
  },
  image: {
    position: "relative",
    zIndex: 2,
    padding: theme.spacing(2, 1),
    [theme.breakpoints.down("sm")]: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
  info: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    zIndex: 1,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(-2),
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(0),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  character: {
    textTransform: "uppercase",
    fontSize: "10px",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    lineHeight: "1em",
    maxHeight: "1em",
  },
  title: {
    lineHeight: "1em",
    maxHeight: "2em",
    height: "2em",
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      fontSize: theme.spacing(1.5),
    },
  },
  price: {
    fontSize: theme.spacing(3),
    lineHeight: "1em",
    fontWeight: 900,
    [theme.breakpoints.down("xs")]: {
      fontSize: theme.spacing(2.5),
    },
  },
  starRating: {
    justifyContent: "flex-start",
    marginTop: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      fontSize: "11px",
    },
  },
}));

const ProductSquare = (props) => {
  const { className, product, character, ...rest } = props;
  const classes = useStyles();

  const productCharacter = character ?? product.character;

  const urlProduct = useMemo(() => `/products/${product.handle}`, [product]);
  const urlCharacter = useMemo(() => `/character/${productCharacter?.handle}`, [productCharacter]);

  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      <Box className={classes.container}>
        <Card className={clsx(classes.card, classes.image)}>
          <ProductImage src={product.preview?.uri} href={urlProduct} />
          {!!productCharacter && (
            <CharacterIcon src={productCharacter?.image} href={urlCharacter} />
          )}
        </Card>
        <Card className={clsx(classes.card, classes.info)}>
          <Typography className={classes.character} variant="subtitle2">
            {productCharacter?.name}&nbsp;
          </Typography>
          <Box paddingTop={1} />
          <Typography className={classes.title} variant="body2">{product.name}</Typography>
          <Box paddingTop={3} />
          <Typography className={classes.price}>${strings.formatMoney(product.price)}</Typography>

          <RatingStar className={classes.starRating} ratingCount={0} />
        </Card>
      </Box>
    </Box>
  );
};

export default ProductSquare;
