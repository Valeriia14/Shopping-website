import { Box, makeStyles, Typography, Hidden } from "@material-ui/core";
import React, { Fragment, useState } from "react";
import Slider from "react-slick";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { RatingStar } from "@ktwebsite/components";
import { cashFormat, ratingStar } from "@ktwebsite/utils/fomatting/diffFormats";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import clsx from "clsx";
import { usePageData } from "@ktwebsite/hooks";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginTop: 30,
    },
  },
  previewBox: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      width: "120px",
    },
  },
  img: {
    width: "100%",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      padding: "8px",
      width: "120px",
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
  limitText: {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "23px",
    textAlign: "center",
    marginTop: "16px",
    marginBottom: "160px",
    color: "#AEA691",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "32px",
    },
  },
  gridItem: {
    width: "calc(100% / 5)",
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% / 3)",
    },
  },
  productBox: {
    paddingRight: 24,
    paddingBottom: 8,
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      paddingRight: 0,
      paddingBottom: 8,
      display: "flex",
    },
  },
  ordinalsBox: {
    top: "0",
    left: "12px",
    width: "32px",
    height: "40px",
    position: "absolute",
    backgroundColor: "#000000",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      width: "22px",
      height: "27px",
      top: "8px",
      left: "16px",
    },
    "& p": {
      fontSize: "16px",
      fontWeight: 700,
      lineHeight: "19px",
      textAlign: "center",
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
  sliderContainer: {
    "& .slick-arrow": {
      "&.slick-next": {
        right: "148px",
        bottom: "-12px",
        top: "unset",
        "& img": {
          height: "12px",
        },
      },
      "&.slick-prev": {
        left: "162px",
        bottom: "-12px",
        top: "unset",
        "& img": {
          transform: "rotate(180deg)",
          height: "12px",
        },
      },
    },
  },
  textPagination: {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "17px",
    textAlign: "center",
    margin: "0px 14px",
  },
  contentBox: {
    [theme.breakpoints.down("xs")]: {
      width: "calc(100% - 120px)",
    },
  },
}));

const ProductListingExtra = () => {
  const classes = useStyles();
  const [swipping, setSwipping] = useState(false);
  const [pagination, setpPgination] = useState(1);
  const productsSale = usePageData((data) => data.products_sale);
  const NextArrow = (props) => {
    const { className, style, onClick } = props;

    return (
      <div className={className} style={{ ...style }}>
        <img
          src="/images/arrow_right_bold.svg"
          alt="arrow_left_bold"
          onClick={onClick}
        />
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;

    return (
      <div className={className} style={{ ...style }}>
        <img
          src="/images/arrow_right_bold.svg"
          alt="arrow_left_bold"
          onClick={onClick}
        />
      </div>
    );
  };
  const settings = {
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    initialSlide: 0,
    swipeToSlide: true,
    autoplay: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (currentSlide, nextSlide) => {
      setSwipping(true);
      setpPgination(nextSlide + 1);
    },
    afterChange: () => {
      setSwipping(false);
    },
  };

  const productItem = (item) => {
    return (
      <Fragment>
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
          <Box className={classes.contentBox} padding="16px">
            <Typography className={classes.titleName}>{item?.name}</Typography>
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
                        ((item?.price - item?.promo_price) / item?.price) * 100
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
      </Fragment>
    );
  };
  return (
    <Box className={classes.root}>
      <Hidden xsDown lgUp>
        <Box display="flex" flexWrap="Wrap">
          {!productsSale
            ? ""
            : productsSale?.map((item, index) => {
                return (
                  <Box className={classes.gridItem} key={index}>
                    {productItem(item)}
                  </Box>
                );
              })}
        </Box>
      </Hidden>
      <Hidden smUp>
        <Slider className={classes.sliderContainer} {...settings}>
          {!productsSale
            ? ""
            : productsSale?.map((item, index) => {
                return <Box key={index}>{productItem(item)}</Box>;
              })}
        </Slider>
        <Typography className={classes.textPagination}>
          {pagination} / {productsSale?.length}
        </Typography>
      </Hidden>
    </Box>
  );
};

export default ProductListingExtra;
