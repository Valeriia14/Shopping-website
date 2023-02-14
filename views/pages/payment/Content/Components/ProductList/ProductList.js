import { BaseButton } from "@ktwebsite/components";
import useApi from "@ktwebsite/utils/api/useApi";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { Box, Button, InputBase, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BigNumber from "bignumber.js";
import { useSnackbar } from "notistack";
import React, { useEffect, useMemo, useState } from "react";

const useStyles = makeStyles((theme) => ({
  cartProductWrap: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginLeft: "0px",
    },
  },
  cartProductImgBox: {
    width: "155px",
    cursor: "pointer",
    padding: "14px 12px 12px",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      width: "90px",
      padding: "2px",
    },
    "& img": {
      background: "#fff",
      borderRadius: theme.spacing(3),
      boxShadow: "0 2px 29px rgba(0,0,0,.2)",
    },
  },
  titleStatusCheckIn: {
    position: "absolute",
    top: 35,
    left: 11,
    boxShadow: " 0 0 5pt 4pt #2ada00a8",
    alignItems: "center",
    padding: " 0px 16px",
    color: "#2ada00a8",
  },
  titleStatusCheckOut: {
    position: "absolute",
    top: 35,
    left: 11,
    boxShadow: " 0 0 5pt 4pt #e53935",
    alignItems: "center",
    padding: " 0px 9px",
    color: "#e53935",
  },
  cartProductImg: {
    width: "130px",
    height: "130px",
    [theme.breakpoints.down("xs")]: {
      width: "90px",
      height: "90px",
    },
  },
  cartProductNameBox: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  cardProductName: {
    fontSize: "16px",
  },
  editBtn: {
    border: "1px solid #bebebe",
    width: "38px",
    height: "19px",
    borderRadius: "3px",
  },
  editBtnText: {
    fontSize: "13px",
    fontWeight: 400,
    color: "#707070",
  },
  cartProductSku: {
    color: "rgba(0,0,0, 0.5)",
    fontSize: "13px",
    lineHeight: "20px",
  },
  cartProductQty: {
    color: "rgba(0,0,0, 0.5)",
    fontSize: "13px",
    lineHeight: "20px",
    marginTop: theme.spacing(1.5),
  },
  cartProductPriceBox: {
    display: "flex",
    flexDirection: "row",
    marginTop: theme.spacing(2),
  },
  cartProductPrice: {
    color: theme.palette.primary.main,
    fontSize: "16px",
    fontWeight: "bold",
  },
  cartProductRrp: {
    color: "rgba(45,40,102,0.5)",
    fontSize: "12px",
    textDecoration: "line-through",
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(0.5),
  },
  cartAccessory: {
    color: "rgba(0,0,0, 0.5)",
    fontSize: "13px",
    lineHeight: "20px",
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
  },
  cartAccessorySum: {
    color: "rgba(0,0,0, 0.5)",
    fontSize: "13px",
    lineHeight: "20px",
    marginTop: theme.spacing(1),
  },
  cartAccessoryWrap: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cartAccessoryBox: {
    // border: "1px dashed #2D2866",
    width: "70px",
    height: "70px",
    marginRight: theme.spacing(1),
    marginBottom: "5px",
    position: "relative",
  },
  cartAccessoryImage: {
    height: "100%",
    width: "100%",
  },
  editActions: {
    display: "flex",
    flexDirection: "row",
  },
  cancelText: {
    color: "#D8D8D8",
    textDecoration: "underline",
    fontSize: "12px",
    cursor: "pointer",
  },
  deleteText: {
    color: "#D8D8D8",
    textDecoration: "underline",
    fontSize: "12px",
    marginLeft: theme.spacing(1.5),
    cursor: "pointer",
  },
  accessoryDropdown: {
    width: "80%",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "2px",
  },
  accessoryNativeSelect: {
    fontSize: "14px",
    background: "#fff",
    "&:hover": {
      borderBottom: "none",
    },
    "&:before": {
      border: "none",
    },
    "&:after": {
      border: "none",
    },
  },
  btnCancelAccessory: {
    position: "absolute",
    right: -10,
    top: -10,
  },
  controlQtyWrap: {
    display: "flex",
    alignItems: "center",
  },
  qtyUpdateBox: {
    border: "1px solid #ccc",
    borderRadius: "30px",
    display: "flex",
    flexDirection: "row",
    width: "120px",
  },
  minusBtn: {
    minWidth: "10px",
    height: "30px",
    "&:hover": {
      background: "none",
    },
  },
  qtyInput: {
    height: "30px",
    width: "100px",
    fontSize: "14px",
    align: "center",
    "& input": {
      textAlign: "center",
    },
  },
  plusBtn: {
    minWidth: "10px",
    height: "30px",
    "&:hover": {
      background: "none",
    },
  },
  updateBtnBox: {
    width: 120,
    height: 30,
    borderRadius: 30,
    marginLeft: "1.5rem",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.primary.dark,
    color: "#fff",
    cursor: "pointer",
  },
  updateBtnBoxDisabled: {
    backgroundColor: theme.palette.primary.disabled,
    color: "#fff !important",
  },
}));

const ProductList = (props) => {
  const classes = useStyles({});
  const { item } = props;

  return (
    <Box className={classes.cartProductWrap} borderBottom="1px solid #d8d8d8">
      <Box className={classes.cartProductImgBox}>
        <img
          src={item?.product?.preview?.uri}
          className={classes.cartProductImg}
        />
        <Typography
          className={
            item?.status === "exchange-in"
              ? classes.titleStatusCheckIn
              : classes.titleStatusCheckOut
          }
        >
          {item?.status === "exchange-in" ? "Exchange In" : "Exchange Out"}
        </Typography>
      </Box>
      <Box ml={2} mt={2} mb={2} flex={1}>
        <Box className={classes.cartProductNameBox}>
          <Typography variant="body1" className={classes.cardProductName}>
            {item?.product?.name? item?.product?.name : "-"}
          </Typography>
        </Box>
        <Box>
          <Typography className={classes.cartProductSku}>
            Item: {item?.sku ? item?.sku : "-"}
          </Typography>
          <Typography className={classes.cartProductQty}>Qty: {item?.quantity ? item?.quantity :"-"}</Typography>
          <Typography className={classes.cartProductQty}>
            Original: SGD {item?.subtotal ? item?.subtotal : "0"}
          </Typography>
        </Box>
        <Box className={classes.cartProductPriceBox}>
          <Typography className={classes.cartProductPrice}>
            SGD {item?.subtotal ? item?.subtotal : "0"}
          </Typography>
          <Typography className={classes.cartProductRrp} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProductList;
