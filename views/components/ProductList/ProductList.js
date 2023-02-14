import { Box, Grid, Typography, Slide } from "@material-ui/core";
import clsx from "clsx";
import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { cashFormat, ratingStar } from "@ktwebsite/utils/fomatting/diffFormats";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { RatingStar } from "@ktwebsite/components";
import { useStyles } from "./styles";

const ProductList = (props) => {
  const { products } = props;
  const classes = useStyles();
  // const [model, setModel] = useState((Array.isArray(products) && products) || []);
  const model = useMemo(() => {
    return products;
  }, [products]);

  const [offset, setOffset] = useState(8);
  const [modelSlice, setModelSlice] = useState([]);

  useEffect(() => {
    if (model) {
      setModelSlice(model.slice(0, 9));
    }
  }, [model]);

  const handleShowMore = useCallback(() => {
    if (offset < model.length) {
      setOffset(offset + 9);
      setModelSlice([...model.slice(0, offset + 9)]);
    }
  }, [offset, model]);
  const handleShowLess = useCallback(() => {
    setOffset(9);
    setModelSlice([...model.slice(0, 9)]);
  }, [model]);
  const showContent = useCallback(() => {
    return model?.map((item, index) => {
      return (
        <Slide key={index} in={true} timeout={500}>
          <Grid id={`item${index}`} xs={6} md={4} item>
            <Box className={classes.productBox}>
              <img
                className={classes.img}
                src={item?.preview?.uri || "/images/placeholder.png"}
                alt={item?.name}
                onClick={() => {
                  doRedirect(`/products/${item?.handle}`);
                }}
              />
              <Box padding="16px">
                <Typography className={classes.titleName}>
                  {item?.name}
                </Typography>

                <Box className={classes.priceBox}>
                  {item?.promo_price ? (
                    <Fragment>
                      <Typography className={classes.price}>
                        {cashFormat(item?.promo_price)}
                      </Typography>
                      <Typography className={classes.salePrice}>
                        {cashFormat(item?.price)}
                      </Typography>
                      <Box className={classes.discountPercent}>
                        <Typography>
                          {Math.round(
                            ((item?.price - item?.promo_price) / item?.price) *
                              100
                          )}
                          %
                        </Typography>
                      </Box>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <Typography className={classes.price}>
                        {cashFormat(item?.price)}
                      </Typography>
                    </Fragment>
                  )}
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={3}
                >
                  <Box display="flex" alignItems="center">
                    <RatingStar
                      className={classes.rating}
                      score={ratingStar(item?.reviews)}
                    />
                    <Typography className={classes.commentText}>
                      &nbsp;{`(${item?.reviews?.length})`}
                    </Typography>
                  </Box>
                  <FavoriteBorderIcon fontSize="inherit" />
                </Box>
                <Box className={classes.tagsBox}>
                  {item?.is_new && (
                    <Typography className={clsx(classes.tagText, classes.pink)}>
                      NEW
                    </Typography>
                  )}
                  {item?.promo_price && (
                    <Typography className={clsx(classes.tagText, classes.blue)}>
                      SALE
                    </Typography>
                  )}
                  {item?.has_gift && (
                    <Typography className={clsx(classes.tagText, classes.red)}>
                      FREE GIFT
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Slide>
      );
    });
  }, [classes, modelSlice]);
  return (
    <Grid xs={12} md={9} item>
      <Box className={classes.root}>
        <Grid container>{showContent()}</Grid>
        <Box
          pt={10}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {model.length > 9 && model.length !== modelSlice.length && (
            <a onClick={handleShowMore} className={classes.button}>
              LOAD MORE ITEMS
            </a>
          )}
          {model.length > 9 && model.length === modelSlice.length && (
            <a
              href="#item3"
              onClick={handleShowLess}
              className={classes.button}
            >
              SHOW LESS ITEMS
            </a>
          )}
          <Typography className={classes.limitText}>
            Showing {modelSlice.length} items of {model.length} items
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default ProductList;
