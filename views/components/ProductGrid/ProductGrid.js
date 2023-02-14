import { Box, Grid, Typography, InputBase } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment } from "react";
import { BaseButton } from "../BaseButton";
import RatingStar from "../RatingStar";

const useStyles = makeStyles((theme) => ({
  productBoxWrap: {
    width: "100%",
  },
  productImgBox: {
    width: "100%",
    borderRadius: "35px",
    boxShadow: "0 0 15px 0 rgba(77,95,111,.3)"
  },
  productImg: {
    width: "100%",
    borderRadius: "20px"
  },
  productDescBox: {
    width: "90%",
    position: "relative",
    marginLeft: "5%",
    minHeight: "170px",
    padding: "10px 14px",
    boxShadow: "0 0 15px -4px rgba(77,95,111,.5)",
    borderBottomLeftRadius: "20px",
    borderBottomRightRadius: "20px",
    backgroundColor: "#fff",
    paddingTop: "20px",
    paddingBottom: "10px",
    marginTop: "-20px",
    [theme.breakpoints.down('xs')]: {
      minHeight: "190px",
      maxHeight: "220px"
    }
  },
  productDesWhiteCover: {
    width: "90%",
    height: "30px",
    marginLeft: "5%",
    zIndex: 40,
    marginTop: "-20px",
    backgroundColor: "#fff",
    position: "relative",
  },
  productBrand: {
    fontSize: "12px",
    textTransform: "uppercase"
  },
  productName: {
    fontSize: "14px",
  },
  productPriceNormal: {
    fontSize: "18px",
    fontWeight: 900
  },
  productPrice: {
    color: "#bb2531",
    fontSize: "18px",
    fontWeight: 900,
    [theme.breakpoints.down('xs')]: {
      fontSize: "16px",
    }
  },
  productFormerPrice: {
    color: "#666666",
    fontSize: " 14px",
    fontWeight: 600,
    textDecoration: "line-through"
  },
  discountGrid: {
    position: "relative"
  },
  discountWrap: {
    position: "absolute",
    backgroundColor: "#f9cc22",
    width: "50px",
    borderRadius: "6px 0px 0px 6px",
    padding: "6px 8px",
    right: -15,
    bottom: 10
  },
  discountText: {
    fontSize: "15px",
    color: "#5e5995",
    fontWeight: 600,
  },
  ratingCountText: {
    fontSize: "14px",
    marginLeft: "5px",
    marginTop: "3px"
  }
}));

const ProductGrid = props => {

  const classes = useStyles({});
  const { productName, discountPrice, normalPrice, image, productBrand, productPrice } = props;
  let discountedAmt = normalPrice - discountPrice;
  let discount = Math.round((discountedAmt * 100) / normalPrice);

  const toProductDetail = () => {
    window.location.href = "/product/" + productName;
  }

  return (
    <Box className={classes.productBoxWrap} onClick={toProductDetail}>
      <Box className={classes.productImgBox}>
        <img src={image} className={classes.productImg} />
      </Box>
      <Box className={classes.productDesWhiteCover}></Box>
      <Box className={classes.productDescBox}>
        <Typography className={classes.productBrand}>{productBrand}</Typography>
        <Typography className={classes.productName}>{productName}</Typography>
        <Grid container item xs={12}>
          <Grid item xs={8}>
            {discountPrice &&
              <Typography className={classes.productPrice}>SGD {discountPrice}</Typography>
            }
            {discountPrice &&
              <Typography className={classes.productFormerPrice}>SGD {normalPrice}</Typography>
            }
            {!discountPrice &&
              <Typography className={classes.productPriceNormal}>SGD {normalPrice}</Typography>
            }
          </Grid>
          <Grid item xs={4} className={classes.discountGrid}>
            {discountPrice &&
              <Box className={classes.discountWrap}>
                <Typography className={classes.discountText}>-{discount}%</Typography>
              </Box>
            }
          </Grid>
          <Box position="absolute" bottom={0} pb={2} display="flex" flexDirection="row">
            <RatingStar />
            <Typography className={classes.ratingCountText}>(10)</Typography>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductGrid;