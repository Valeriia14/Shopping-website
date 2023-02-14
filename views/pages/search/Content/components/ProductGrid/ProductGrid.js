import { Box, Grid, Typography, InputBase } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment } from "react";
import { BaseButton } from "@ktwebsite/components";


const useStyles = makeStyles((theme) => ({
  productBoxWrap: {
    width: "100%",
  },
  productImgBox: {
    width: "100%",
    borderRadius: "55px",
    boxShadow: "0 0 15px 0 rgba(77,95,111,.3)"
  },
  productImg: {
    width: "100%",
    borderRadius: "44px"
  },
  productDescBox: {
    width: "80%",
    marginLeft: "10%",
    padding: "10px 14px",
    boxShadow: "0 0 15px -4px rgba(77,95,111,.5)",
    borderBottomLeftRadius: "30px",
    borderBottomRightRadius: "30px",
    backgroundColor: "#fff",
    paddingTop: "20px",
    paddingBottom: "40px",
    marginTop: "-20px",
  },
  productDesWhiteCover: {
    width: "80%",
    height: "30px",
    marginLeft: "10%",
    zIndex: 40,
    marginTop: "-20px",
    backgroundColor: "#fff",
    position: "relative",
  },
  productName: {
    fontSize: "16px",
  },
  productPrice: {
    color: "#bb2531",
    fontSize: "18px",
    fontWeight: 900
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
}));

const ProductGrid = props => {

  const classes = useStyles({});
  const { productName, discountPrice, normalPrice, image } = props;
  let discountedAmt = normalPrice - discountPrice;
  let discount = Math.round((discountedAmt * 100) / normalPrice);

  return (
    <Box className={classes.productBoxWrap}>
      <Box className={classes.productImgBox}>
        <img src={image} className={classes.productImg} />
      </Box>
      <Box className={classes.productDesWhiteCover}></Box>
      <Box className={classes.productDescBox}>
        <Typography className={classes.productName}>{productName}</Typography>
        <Grid container item xs={12}>
          <Grid item xs={8}>
            <Typography className={classes.productPrice}>SGD {discountPrice}</Typography>
            <Typography className={classes.productFormerPrice}>SGD {normalPrice}</Typography>
          </Grid>
          <Grid item xs={4} className={classes.discountGrid}>
            <Box className={classes.discountWrap}>
              <Typography className={classes.discountText}>-{discount}%</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductGrid;
