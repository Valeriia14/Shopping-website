import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import { BaseButton } from "@ktwebsite/components";
import OrderItem from "./OrderItem";
import OrderStatus from "./OrderStatus";

const useStyles = makeStyles((theme) => ({
  imgGrid: {
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  imgGridMobile: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "block"
    }
  },
  orderHistoryBox: {
    maxHeight: "870px",
    width: "95%",
    marginLeft: "2.5%",
    border: "2px solid rgba(45,40,102,.1)",
    borderRadius: "21px",
    background: "#FCFCFC",
    padding: theme.spacing(3),
    marginBottom: theme.spacing(1)
  },
  cartOrderIcon: {
    width: "75px",
    [theme.breakpoints.down("xs")]: {
      width: "65px",
      marginRight: "5px"
    }
  },
  orderRefBox: {
    borderBottom: "1px solid #ccc",
    display: "flex",
    flexDirection: "row",
    width: 300,
    paddingBottom: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      height: "30px"
    }
  },
  orderRefText: {
    fontSize: "16px"
  },
  orderRefNoText: {
    fontSize: "16px",
    fontWeight: "bold",
    marginLeft: theme.spacing(1)
  },
  orderSummaryTab: {
    display: "flex",
    flexDirection: "row",
    marginTop: theme.spacing(3)
  },
  orderItemBox: {
  },
  orderItemBoxUnderline: {
    borderBottom: "4px solid #2d2866"
  },
  orderItemsText: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#2d2866",
    cursor: "pointer"
  },
  orderSummaryBox: {
    marginLeft: theme.spacing(2)
  },
  orderSummaryText: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#2d2866",
    cursor: "pointer"
  },
  orderItemListBox: {
    borderRadius: "5px",
    border: "1px solid rgba(45,40,102,.1)",
    marginTop: theme.spacing(2),
    background: "#fff",
    padding: theme.spacing(2)
  },
  totalCostBox: {
    borderTop: "1px solid rgba(45,40,102,.1)",
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(2)
  },
  costSummaryWrap: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginLeft: "40%",
    marginTop: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginLeft: "0%"
    }
  },
  costSummaryWrapUnderline: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginLeft: "40%",
    marginTop: theme.spacing(1),
    borderBottom: "1px solid rgba(45,40,102,.1)",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginLeft: "0%"
    }
  },
  subTotalText: {
    fontSize: "16px"
  },
  redeemedText: {
    fontSize: "16px",
    color: "#e83c5e"
  },
  voucherText: {
    fontSize: "16px",
    color: "#e83c5e"
  },
  totalOrderText: {
    fontSize: "16px",
    fontWeight: "bold"
  },
  pointEarnedText: {
    fontSize: "16px",
    color: "#1cb372"
  },
  closeBtn: {
    height: "28px",
    width: "130px",
    background: "#2d2866",
    borderRadius: "24px",
    "&:hover": {
      background: "#2d2866"
    },
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  closeBtnText: {
    color: "#fff",
    fontSize: "14px",
    textAlign: "center"
  },
  summaryText: {
    fontSize: "14px"
  },
  orderInfo: {
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  orderInfoMobile: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "block"
    }
  }
}));

const OrderSummary = props => {
  const classes = useStyles();
  const { detail, opened } = props;
  const [showState, setShowState] = useState("orderItem");
  const [showDetail, setShowDetail] = useState(true);

  const tabHandler = (showState) => {
    setShowState(showState);
  }

  const toggleDetail = () => {
    setShowDetail(!showDetail);
  }

  useEffect(() => {
    if (opened) {
      setShowDetail(true);
    } else {
      setShowDetail(false);
    }
  }, []);

  return (
    <Box className={classes.orderHistoryBox}>
      <Grid container item xs={12}>
        <Grid item xs={2} className={classes.imgGrid}>
          <img src="/images/account-order-icon.png" className={classes.cartOrderIcon} />
        </Grid>
        <Grid item xs={12} sm={10}>
          <Box display="flex" flexDirection="row">
            <Box className={classes.imgGridMobile}>
              <img src="/images/account-order-icon.png" className={classes.cartOrderIcon} />
            </Box>
            <Box display="flex" flex="1" flexDirection="column">
              <Box display="flex" flex="1" flexDirection="row" justifyContent="space-between">
                <Box className={classes.orderRefBox}>
                  <Typography className={classes.orderRefText}>Order Reference: </Typography>
                  <Typography className={classes.orderRefNoText}>#{detail.reference}</Typography>
                </Box>
                <Box>
                  <BaseButton text={!showDetail ? "order details" : "close"} buttonClassName={classes.closeBtn} textClassName={classes.closeBtnText} onClick={toggleDetail} />
                </Box>
              </Box>
              <Box mt={1} className={classes.orderInfoMobile}>
                <Typography className={classes.summaryText}>Payment Total: ${detail.subtotal}</Typography>
                <Typography className={classes.summaryText}>Order Date: {detail.date? detail.date : "-"}</Typography>
                <Typography className={classes.summaryText}>Order Status: {detail.status}</Typography>
              </Box>
            </Box>
          </Box>
          {!showDetail &&
            <Box mt={1} className={classes.orderInfo}>
              <Typography className={classes.summaryText}>Payment Total: ${detail.subtotal}</Typography>
              <Typography className={classes.summaryText}>Order Date: {detail.date? detail.date : "-"}</Typography>
              <Typography className={classes.summaryText}>Order Status: {detail.status}</Typography>
            </Box>
          }
          {showDetail &&
            <Box>
              <Box className={classes.orderSummaryTab}>
                <Box className={`${classes.orderItemBox} ${showState == "orderItem" ? classes.orderItemBoxUnderline : ""}`}>
                  <Typography className={classes.orderItemsText} onClick={() => tabHandler("orderItem")}>ORDER ITEMS</Typography>
                </Box>
                <Box className={`${classes.orderSummaryBox} ${showState == "summary" ? classes.orderItemBoxUnderline : ""}`}>
                  <Typography className={classes.orderSummaryText} onClick={() => tabHandler("summary")}>SUMMARY</Typography>
                </Box>
              </Box>
              <Box className={classes.orderItemListBox}>
                {showState == "orderItem" &&
                  <Box>
                    {detail?.order_items?.
                    filter(
                      (item) => { //eslint-disable-line
                        switch (item.status) {
                          case "refunded":
                            break;
                          case "exchange-out":
                            break;
                          case "exchanged-out":
                            break;
                          default:
                            return item;
                        }
                      }
                    )
                    .map(item =>
                      <OrderItem item={item} key={item.id} />
                    )}
                  </Box>
                }
                {showState == "summary" &&
                  <Grid container item xs={12}>
                    <OrderStatus detail={detail} />
                  </Grid>
                }
              </Box>
              <Box className={classes.totalCostBox}>
                <Box className={classes.costSummaryWrap}>
                  <Typography className={classes.subTotalText}>Sub total:</Typography>
                  <Typography className={classes.subTotalText}>${detail.subtotal || 0}</Typography>
                </Box>
                {detail?.discount_code && detail?.discount && (
                  <Box className={classes.costSummaryWrap}>
                    <Typography className={classes.voucherText}>{`Promo code (${detail?.discount_code || ''})`}</Typography>
                    <Typography className={classes.voucherText}>{`-$${detail?.discount || 0}`}</Typography>
                  </Box>
                )}
                {detail?.points_discount && (
                  <Box className={classes.costSummaryWrap}>
                    <Typography className={classes.redeemedText}>Redeemed points: </Typography>
                    <Typography className={classes.redeemedText}>{`-$${detail?.points_discount || 0}`}</Typography>
                  </Box>
                )}
                <Box className={classes.costSummaryWrap}>
                  <Typography className={classes.subTotalText}>Shipping Fee:</Typography>
                  <Typography className={classes.subTotalText}>$0.00</Typography>
                </Box>
                <Box className={classes.costSummaryWrapUnderline}>
                </Box>
                <Box className={classes.costSummaryWrap}>
                  <Typography className={classes.totalOrderText}>Order Total:</Typography>
                  <Typography className={classes.totalOrderText}>${detail.total}</Typography>
                </Box>
                <Box className={classes.costSummaryWrap} pb={4}>
                  <Typography className={classes.pointEarnedText}>Kidztime points to be earned:</Typography>
                  <Typography className={classes.pointEarnedText}>{detail.total ? Math.round(detail.total) : 0}</Typography>
                </Box>
              </Box>
            </Box>
          }
        </Grid>
      </Grid>
    </Box >

  );
};

export default OrderSummary;
