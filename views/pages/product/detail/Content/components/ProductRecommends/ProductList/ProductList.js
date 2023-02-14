import { Box, Grid, Typography } from "@material-ui/core";
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
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
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
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (model) {
      setModelSlice(model.slice(0, 9));
    }
  }, [model]);
  const moveBehind = () => {
    console.log(value);
    value === -100 * (model.length - 5) ? setValue(0) : setValue(value - 125);
  };
  const moveAhead = () => {
    console.log(value);
    value === 0 ? setValue(-100 * (model.length - 5)) : setValue(value + 125);
  };

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
  const showContent = useCallback((transValue) => {
    return model?.map((item, index) => {
      return (
        <Grid
          style={{
            margin: 20,
            transition: "0.5s",
            transform: `translateX(${transValue}%)`,
          }}
          id={`item${index}`}
          xs={6}
          md={2}
          item
          key={index}
        >
          <Box className={classes.productBox}>
            <img
              className={classes.img}
              src={item?.preview?.uri || "/images/placeholder.png"}
              alt={item?.name}
              onClick={() => {
                doRedirect(`/products/${item?.handle}`);
              }}
            />
            <Box>
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
      );
    });
  }, [classes, modelSlice]);
  return (
    <Grid xs={12} md={12} item>
      <Box className={classes.root}>
        <Grid
          style={{
            justifyContent: "space-between",
            width: "100%",
            boxSizing: "border-box",
            margin: 0,
            padding: 0,
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "center",
            position: "relative",
            overflowX: "clip",
          }}
          container
        >
          <ArrowBackIosIcon
            fontSize="large"
            sx={{ fontSize: 40 }}
            style={{
              zIndex: 1000,
              margin: 0,
              cursor: "pointer",
              padding: 0,
              position: "absolute",
              background: "none",
              top: "-53px",
              right: "37px",
              transform: "translateY(-48%)",
              width: "fit-content",
              height: "30px",
              color: "#000000",
              borderRight: "black 2px solid",
            }}
            onClick={() => {
              if (model.length > 5) return moveAhead;
            }}
          />
          <ArrowForwardIosIcon
            fontSize="large"
            sx={{ fontSize: 40 }}
            style={{
              zIndex: 1000,
              cursor: "pointer",
              margin: 0,
              padding: 0,
              position: "absolute",
              background: "none",
              top: "-53",
              right: "0",
              transform: "translateY(-48%)",
              width: "fit-content",
              height: "30px",
              color: "#000000",
            }}
            onClick={() => {
              if (model.length > 5) return moveBehind;
            }}
          />
          {showContent(value)}
        </Grid>
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
