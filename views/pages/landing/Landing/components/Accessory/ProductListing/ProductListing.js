import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { Fragment, useState } from "react";
import Slider from "react-slick";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { RatingStar } from "@ktwebsite/components";
import { cashFormat, ratingStar } from "@ktwebsite/utils/fomatting/diffFormats";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "calc(100% - 25px)",
    marginBottom: 177,
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginTop: 30,
      marginBottom: 50,
    },
  },
  previewBox: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: "100%",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      padding: "8px",
    },
  },
  tagsBox: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 24,
  },
  tagText: {
    padding: "6px 10px",
    marginRight: "8px",
    fontSize: "10px",
    fontWeight: 700,
    lineHeight: "12px",
    letterSpacing: "0px",
    textAlign: "left",
    color: "white",
    marginBottom: 8,
  },
  titleName: {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "23px",
    textAlign: "left",
    wordBreak: "break-word",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    maxHeight: "68px",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical"
  },
  pink: {
    backgroundColor: "#F4C0C0",
  },
  blue: {
    backgroundColor: "#618CAC",
  },
  red: {
    backgroundColor: "#ED7777",
  },
  button: {
    width: "300px",
    fontSize: "18px",
    fontWeight: 500,
    lineHeight: "22px",
    textAlign: "center",
    backgroundColor: "#1e3a3a",
    color: "white",
    borderRadius: "0px",
    textDecoration: "none",
    padding: "10px",
    "&:hover": {
      backgroundColor: "#1e3a3a",
    },
  },
  productBox: {
    paddingRight: 24,
    paddingBottom: 8,
    position: "relative",
    maxWidth: "236px",
    height: "486px",
    margin: "auto",
    [theme.breakpoints.down("xs")]: {
      paddingRight: 14,
      paddingLeft: 20,
      paddingBottom: 8,
    },
  },
  commentText: {
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: "14px",
    textAlign: "left",
  },
  rating: {
    fontSize: 15,
    alignItems: "center",
  },
  price: {
    fontSize: "18px",
    color: "#000000",
    lineHeight: "22px",
    fontWeight: 600,
  },
  discountPercent: {
    "& p": {
      fontSize: "18px",
      color: "#D20000",
      lineHeight: "22px",
      fontWeight: 600,
    },
    marginLeft: "auto",
  },
  salePrice: {
    marginLeft: "15px",
    fontSize: "16px",
    lineHeight: "20px",
    color: "#7B7B7B",
    textDecoration: "line-through",
    textDecorationColor: "#7B7B7B",
  },
  priceBox: {
    flexDirection: "row",
    display: "flex",
    height: "38px",
    alignItems: "baseline",
    marginTop: "10px",
    marginBottom: "26px",
  },
}));

const ProductListing = (props) => {
  const classes = useStyles();
  const [swipping, setSwipping] = useState(false);
  const { products } = props;
  const settings = {
    dots: false,
    slidesToShow: products && products.length < 7 ? products.length : 7,
    slidesToScroll: 1,
    infinite: true,
    initialSlide: 0,
    swipeToSlide: true,
    autoplay: false,
    beforeChange: () => {
      setSwipping(true);
    },
    afterChange: () => {
      setSwipping(false);
    },
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: products && products.length < 2 ? products.length : 3,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: products && products.length < 2 ? products.length : 2,
        },
      },
    ],
  };
  return (
    <Box className={classes.root}>
      <Slider {...settings}>
        {!products
          ? ""
          : products.map((item, index) => {
              return (
                <Fragment key={index}>
                  <Box className={classes.productBox}>
                    <Box className={classes.previewBox}>
                      <img
                        className={classes.img}
                        src={item?.preview?.uri || "/images/placeholder.png"}
                        alt={item?.name}
                        onClick={() => {
                          !swipping && doRedirect(`/products/${item?.handle}`);
                        }}
                      />
                    </Box>
                    <Box padding="16px 0px">
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
                                  ((item?.price - item?.promo_price) /
                                    item?.price) *
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
                          <Typography
                            className={clsx(classes.tagText, classes.pink)}
                          >
                            NEW
                          </Typography>
                        )}
                        {item?.promo_price && (
                          <Typography
                            className={clsx(classes.tagText, classes.blue)}
                          >
                            SALE
                          </Typography>
                        )}
                        {item?.has_gift && (
                          <Typography
                            className={clsx(classes.tagText, classes.red)}
                          >
                            FREE GIFT
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Fragment>
              );
            })}
      </Slider>
    </Box>
  );
};

export default ProductListing;
