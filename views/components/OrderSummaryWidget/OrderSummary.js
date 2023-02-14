import { BaseButton } from "@ktwebsite/components";
import { useCart } from "@ktwebsite/hooks";
import theme from "@ktwebsite/theme";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { parseNumber } from "@ktwebsite/utils/strings/generators";
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Collapse,
  Hidden,
  Fade,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import BigNumber from "bignumber.js";
import React, { useEffect, useMemo, useState } from "react";
import { CheckoutWithPoints, Coupon, CartWidget } from "./components";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import StickyActionBox from "../StickyActionBox";
import cookie from "cookie";
import { calSubtotal } from "@ktwebsite/utils/fomatting/calculate";
import { cashFormat } from "@ktwebsite/utils/fomatting/diffFormats";

const useStyles = makeStyles((theme) => ({
  orderSummaryBoxCollapse: {
    width: "100%",
    border: "1px solid " + theme.palette.boxBorder,
    backgroundColor: "#fff",
    padding: theme.spacing(3, 3),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  orderSummaryHeaderCollapse: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#000000",
  },
  orderSummaryCollapseContainer: {
    marginTop: theme.spacing(2),
  },
  orderSummaryBox: {
    width: "100%",
    border: "1px solid " + theme.palette.boxBorder,
    backgroundColor: "#fff",
    padding: theme.spacing(3, 3),
    marginTop: "30px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginTop: theme.spacing(7)
    },
  },
  orderSummaryHeader: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#000000",
    marginBottom: theme.spacing(2),
  },
  totalSummaryBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalSummaryText: {
    fontSize: "16px",
    fontWeight: 700,
  },
  discountCollapseText: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#333333",
  },
  promoCodeBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  promoCodeText: {
    fontSize: "16px",
    fontWeight: 500,
    color: theme.palette.secondary.main,
  },
  orderTotalBox: {
    borderTop: "1px solid #BDBDBD",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  orderTotalText: {
    fontSize: "24px",
    fontWeight: 700,
  },
  pointRewardBox: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  pointRewardText: {
    fontSize: "16px",
    fontWeight: 500,
    marginTop: theme.spacing(1),
  },
  shippingMethodBox: {
    border: "1px solid #BDBDBD",
    borderRadius: "11px",
    padding: "23px 12px",
    marginBottom: "32px",
  },
  shippingDescription: {
    fontSize: "18px",
    marginLeft: "32px",
    color: "#a8acb9",
  },
  checkoutBtn: {
    marginTop: theme.spacing(2),
    background: "#000000",
    width: "100%",
    height: "48px",
    borderRadius: "0px",
    [theme.breakpoints.down("xs")]: {
      marginTop: 0,
    },
  },
  checkoutBtnText: {
    fontSize: "18px",
    color: "#fff",
    fontWeight: 500,
  },
  additionalInfo: {
    padding: theme.spacing(4, 3),
    backgroundColor: "#1E3A3A",
    border: "1px solid " + theme.palette.boxBorder,
    borderTop: "0px",
  },
  additionalInfoText: {
    fontSize: "14px",
    fontWeight: 500,
    color:"#FFFFFF"
  },
  subtotal: {
    fontSize: "24px",
    fontWeight: 700,
  },
  bodyText: {
    fontSize: "16px",
    fontWeight: 500,
  },
  link: {
    fontWeight: "bold",
    color:"#FFFFFF"
  },
  imgMenu: {
    width: "20px",
    maxHeight: "20px",
    objectFit: "contain",
    margin: "10px 6px 0px"
  },
}));

const OrderSummary = (props) => {
  const {
    disabled: disableAction,
    summaryCollapse,
    hideCartWidget,
    isSelected,
    inCartPage,
    tabActive
  } = props;
  const classes = useStyles({});
  let cart_session = inCartPage
    ? null
    : typeof window === "undefined"
    ? null
    : sessionStorage.getItem("cart");
  cart_session = JSON.parse(cart_session);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [disabled, setDisabled] = useState(disableAction);
  const [disabledCheckout, setDisabledCheckout] = useState(false);
  const [isCollapsedDiscount, setCollapseDiscount] = useState(false);
  const [isCollapsedSummary, setCollapseSummary] = useState(false);
  const [cartItems, setCartItems] = useState(cart_session?.cartItems || null);
  const [coupon, setCoupon] = useState(cart_session?.coupon || null);

  const shippingFee = inCartPage
    ? null
    : typeof window === "undefined"
    ? null
    : parseInt(sessionStorage.getItem("shippingFee") || "0");

  useEffect(() => {
    if (isSelected) {
      let cartItems = Object.keys(isSelected).reduce((acc, key) => {
        if (isSelected[key]) {
          acc.push(isSelected[key]);
          return acc;
        } else {
          return acc;
        }
      }, []);
      setCartItems(cartItems);
    }
  }, [isSelected]);

  useEffect(() => {
    if (cartItems?.length === 0) {
      // setDisabled(true);
      setDisabledCheckout(true)
    } else {
      setDisabledCheckout(false)
    }
  }, [cartItems]);
  const onChangePoints = (points) => {
    setPointsToUse(points);
  };

  const { subtotal, total, items, totalDiscount, shippingFeeAmt, points, pointsCanUse } =
    useMemo(() => {
      const subtotal = calSubtotal(cartItems);
      let totalDiscount =
        (coupon?.voucher_value || 0) >= subtotal
          ? subtotal
          : coupon?.voucher_value || 0;
      const pointsCanUse = cart_session
        ? cart_session?.pointsToUse / 10
        : pointsToUse / 10;
      let points = 0;
      if (totalDiscount > 0 && pointsCanUse > 0) {
        points =
          pointsCanUse > parseFloat(Number(subtotal - totalDiscount).toFixed(2))
            ? parseFloat(Number(subtotal - totalDiscount).toFixed(2))
            : pointsCanUse;
      } else if (totalDiscount === 0 && pointsCanUse > 0) {
        points = pointsCanUse > subtotal ? subtotal : pointsCanUse;
      }
      totalDiscount += points;
      const shippingFeeAmt = shippingFee;
      const total = BigNumber.max(
        subtotal - totalDiscount + (shippingFee || 0),
        0
      );
      return {
        subtotal,
        total,
        items: cart_session?.cartItems || [],
        totalDiscount,
        shippingFeeAmt,
        points,
      };
    }, [pointsToUse, cartItems, coupon, cart_session, shippingFee]);

  const onCheckOut = () => {
    const cookies = cookie.parse(document?.cookie);
    if (!cookies?.authorization) {
      localStorage.setItem("urlAfterSignIn", "/cart");
      doRedirect("/auth/signin");
    } else {
      const cart = {
        cartItems,
        coupon: coupon,
        pointsToUse: pointsToUse,
        pointsCanUse: points
      };
      sessionStorage.setItem("cart", JSON.stringify(cart));
      doRedirect("/shipping_method");
    }
  };

  const getShippingFee = ()=>{
    const tabActiveSession = typeof window === "undefined" ? null : JSON.parse(sessionStorage.getItem("tabActive"));
    if((tabActive || tabActiveSession) === 1){
      return cashFormat(0)
    }
    if(parseInt(subtotal) >= 30){
      (typeof window === 'undefined' ? null :sessionStorage.setItem("isFreeShipping", 1))
      return  cashFormat(0)
    } 
    (typeof window === 'undefined' ? null :sessionStorage.setItem("isFreeShipping", 0))
    return inCartPage ? "Not yet calculated" : cashFormat(3)
  }
  return (
    <Box className={summaryCollapse ? classes.orderSummaryBoxCollapse : ""}>
      {summaryCollapse && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          onClick={() => setCollapseSummary(!isCollapsedSummary)}
        >
          <Typography
            variant="h3"
            className={classes.orderSummaryHeaderCollapse}
          >
            CHECK ORDER SUMMARY
          </Typography>
          <ExpandMoreIcon />
        </Box>
      )}
      <Collapse
        in={isCollapsedSummary || !summaryCollapse}
        className={classes.summaryCollapseContainer}
      >
        {!hideCartWidget && (
          <CartWidget items={items} noCollapse={summaryCollapse} />
        )}
        <Box className={summaryCollapse ? "" : classes.orderSummaryBox}>
          {!summaryCollapse && (
            <Typography variant="h3" className={classes.orderSummaryHeader}>
              ORDER SUMMARY
            </Typography>
          )}

          <Box className={classes.totalSummaryBox}>
            <Typography variant="body1" className={classes.totalSummaryText}>
              SUBTOTAL:
            </Typography>
            <Typography
              variant="body1"
              className={classes.subtotal}
            >{`${cashFormat(subtotal)}`}</Typography>
          </Box>
          <Box className={classes.totalSummaryBox}>
            <Typography variant="body1" className={classes.totalSummaryText}>
              TAX:
            </Typography>
            <Typography variant="body1" className={classes.bodyText}>
              {"Inclusive of 7% GST"}
            </Typography>
          </Box>
          <Box className={classes.totalSummaryBox}>
            <Typography variant="body1" className={classes.totalSummaryText}>
              SHIPPING:
            </Typography>
            <Typography variant="body1" className={classes.bodyText}>
              {getShippingFee()}
            </Typography>
          </Box>
          <Coupon disabled={disabled} coupon={coupon} setCoupon={setCoupon} />
          <CheckoutWithPoints
            onChangePoints={onChangePoints}
            disabled={disabled}
            checkDisabled={(coupon?.voucher_value || 0) >= subtotal}
          />

          <Box
            className={classes.orderTotalBox}
            onClick={() => setCollapseDiscount(!isCollapsedDiscount)}
          >
            <Box display="flex">
              <Typography variant="body1" className={classes.totalSummaryText}>
                DISCOUNT
              </Typography>
              {!isCollapsedDiscount && <ExpandMoreIcon />}
              {isCollapsedDiscount && (
                <Fade in={isCollapsedDiscount}>
                  <ExpandLessIcon />
                </Fade>
              )}
            </Box>
            <Typography variant="body1" className={classes.totalSummaryText}>
              -{cashFormat(totalDiscount)}
            </Typography>
          </Box>
          <Collapse in={isCollapsedDiscount}>
            <Box className={classes.totalSummaryBox}>
              <Typography
                variant="body1"
                className={classes.discountCollapseText}
              >
                Coupon code
              </Typography>
              <Typography
                variant="body1"
                className={classes.discountCollapseText}
              >
                -
                {cashFormat(
                  (coupon?.voucher_value || 0) >= subtotal
                    ? subtotal
                    : coupon?.voucher_value || 0
                )}
              </Typography>
            </Box>
            <Box className={classes.totalSummaryBox}>
              <Typography
                variant="body1"
                className={classes.discountCollapseText}
              >
                Kidztime points
              </Typography>
              <Typography
                variant="body1"
                className={classes.discountCollapseText}
              >
                -{cashFormat(points)}
              </Typography>
            </Box>
          </Collapse>

          <Box className={classes.orderTotalBox}>
            <Typography variant="body1" className={classes.orderTotalText}>
              TOTAL
            </Typography>
            <Typography variant="body1" className={classes.orderTotalText}>
              ${total.toFormat(2)}
            </Typography>
          </Box>

          {!disabled && (
            <>
              <Hidden xsDown={true}>
                <BaseButton
                  text="CHECKOUT"
                  disabled={disabledCheckout}
                  buttonClassName={classes.checkoutBtn}
                  textClassName={classes.checkoutBtnText}
                  onClick={onCheckOut}
                />
              </Hidden>
              <Hidden smUp={true}>
                <StickyActionBox>
                  <BaseButton
                    text="CHECKOUT"
                    disabled={disabledCheckout}
                    buttonClassName={classes.checkoutBtn}
                    textClassName={classes.checkoutBtnText}
                    onClick={onCheckOut}
                  />
                </StickyActionBox>
              </Hidden>
            </>
          )}

          <Box className={classes.pointRewardBox}>
              <img
                src="/images/point-icon.svg"
                className={classes.imgMenu}
                alt=""
              />
            <Typography variant="body1" className={classes.pointRewardText}>
              You will earn <b>{total.toFormat(0)}</b> points for this purchase
            </Typography>
          </Box>
        </Box>
        <Box className={summaryCollapse ? "" : classes.additionalInfo}>
          <Typography variant="body1" className={classes.additionalInfoText}>
            Free shipping and return/exchange of items are available. See{" "}
            <a
              href="/"
              className={classes.link}
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>{" "}
            for more details
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
};

export default OrderSummary;
