import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { BaseButton } from "@ktwebsite/components";
import theme from "@ktwebsite/theme";

const useStyles = makeStyles((theme) => ({
  orderSummaryBox: {
    width: "100%",
    boxShadow: "0 0 20px rgba(77,95,111,.3)",
    borderRadius: "54px",
    backgroundColor: "#fff",
    padding: "50px 25px",
    marginTop: theme.spacing(12),
    [theme.breakpoints.down("sm")]: {
      width: "90%",
      marginLeft: "5%",
      marginTop: theme.spacing(0),
      boxShadow: "none",
      border: "none"
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginLeft: "0px",
      padding: "0px 0px",
    }
  },
  orderSummaryHeader: {
    fontSize: "24px",
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(4)
  },
  shippingDesc: {
    color: "#A9ADBA"
  },
  subtotalSummaryBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  subtotalSummaryText: {
    fontSize: "16px",
    fontWeight: 500
  },
  promoCodeBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  promoCodeText: {
    fontSize: "16px",
    fontWeight: 500,
    color: theme.palette.secondary.main
  },
  kidztimeRewardPointBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  kidztimeRewardPointText: {
    fontSize: "16px",
    fontWeight: 500,
    color: "#D8D8D8"
  },
  orderTotalBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1px solid #dfdeea",
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(1)
  },
  orderTotalText: {
    fontSize: "16px",
    fontWeight: 500,
  },
  pointRewardBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  pointRewardText: {
    fontSize: "16px",
    fontWeight: 500,
    color: "#01AF01"
  },
  shippingMethodBox: {
    border: "1px solid #dfdeea",
    borderRadius: "11px",
    padding: "23px 12px",
    marginBottom: "32px"
  },
  shippingDescription: {
    fontSize: "18px",
    marginLeft: "32px",
    color: "#a8acb9"
  },
  checkoutBtn: {
    background: "#1cb372",
    width: "100%",
    height: "48px",
    borderRadius: "49px",
  },
  checkoutBtnText: {
    fontsuze: "22px",
    color: "#fff",
    fontWeight: 800
  },
  signUpBox: {
    display: "flex",
    flexDirection: "row",
    background: "#FFF9FD",
    padding: "10px",
    justifyContent: "space-between"
  },
  signUpAndGetPointText: {
    color: theme.palette.secondary.main,
    fontSize: "15px",
    fontWeight: "bold",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    }
  },
  signUpText: {
    color: theme.palette.secondary.main,
    fontSize: "14px",
    paddingRight: "4px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    }
  },
  logInText: {
    color: theme.palette.secondary.main,
    fontSize: "14px",
    paddingLeft: "4px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    }
  },
  noticeBox: {
    padding: "15px",
    background: "#F7F6FF",
    borderRadius: "15px",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6)
  },
  noticeTitle: {
    fontWeight: "600",
    color: "#067DFF",
    fontSize: "14px"
  },
  noticeDesc: {
    color: "#067DFF",
    fontSize: "12px"
  }
}));

const OrderSummary = props => {

  const classes = useStyles({});
  const { onProceed, loading, cartSummary, disabled } = props;

  return (
    <Box className={classes.orderSummaryBox}>
      <Box mb={-3}>
        <Typography variant="h3" className={classes.orderSummaryHeader}>SELECT A SHIPPING METHOD</Typography>
      </Box>
      <Box className={classes.shippingMethodBox}>
        <Typography variant="body1">Free Shipping</Typography>
        <Typography variant="body2" className={classes.shippingDesc}>Free over SGD 30</Typography>
      </Box>
      <Typography variant="h3" className={classes.orderSummaryHeader}>ORDER SUMMARY</Typography>
      <Box className={classes.subtotalSummaryBox}>
        <Typography variant="body1" className={classes.subtotalSummaryText}>Sub total:</Typography>
        <Typography variant="body1" className={classes.subtotalSummaryText}>${cartSummary.subtotal}</Typography>
      </Box>
      <Box className={classes.promoCodeBox}>
        <Typography variant="body1" className={classes.promoCodeText}>Promo code:</Typography>
        <Typography variant="body1" className={classes.promoCodeText}>{cartSummary.promoCodeDiscount}</Typography>
      </Box>
      <Box className={classes.promoCodeBox}>
        <Typography variant="body1" className={classes.promoCodeText}>Redeemed points:</Typography>
        <Typography variant="body1" className={classes.promoCodeText}>{cartSummary.pointsDiscount}</Typography>
      </Box>
      <Box className={classes.subtotalSummaryBox}>
        <Typography variant="body1" className={classes.subtotalSummaryText}>Shipping fee:</Typography>
        <Typography variant="body1" className={classes.subtotalSummaryText}>{cartSummary.shippingFee}</Typography>
      </Box>
      <Box className={classes.orderTotalBox}>
        <Typography variant="body1" className={classes.orderTotalText}>Order Total:</Typography>
        <Typography variant="body1" className={classes.orderTotalText}>${cartSummary.total}</Typography>
      </Box>
      <Box className={classes.pointRewardBox}>
        <Typography variant="body1" className={classes.pointRewardText}>Kidztime points to be earned:</Typography>
        <Typography variant="body1" className={classes.pointRewardText}>{Math.round(cartSummary.total)}pt</Typography>
      </Box>
      <Box className={classes.noticeBox}>
        <Typography variant="body1" className={classes.noticeTitle}>CONGRATULATION!!</Typography>
        <Typography variant="body2" className={classes.noticeDesc}>Your cart qualifies for a free eco-sipper giftaway!!</Typography>
        <Typography variant="body2" className={classes.noticeDesc}>Enjoy your gift :)</Typography>
      </Box>
      <Box mt={3}>
        <BaseButton text="PLACE ORDER" loading={loading} buttonClassName={classes.checkoutBtn} textClassName={classes.checkoutBtnText} onClick={onProceed} disabled={disabled} />
      </Box>
    </Box>
  );
};

export default OrderSummary;
