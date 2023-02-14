import {
  Box,
  Typography,
  Grid,
  Divider,
  Hidden,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment, useState } from "react";
import { NotFoundPage } from "@ktwebsite/components";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import PromptRefundItem from "../PromptRefundItem";
import PromptExchangeItem from "../PromptExchangeItem";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "19px",
  },
  Divider: {
    margin: "12px 0px",
    backgroundColor: "black",
    border: "none",
    height: "3px",
  },
  DividerThin: {
    margin: "12px 0px",
    backgroundColor: "black",
    border: "none",
    height: "1px",
  },
  headerTable: {
    fontWeight: "bold",
    fontSize: "16px",
    fontFamily: "Barlow-ExtraBold",
  },
  textRow: {
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "20px",
    marginTop: theme.spacing(1),
    fontFamily: "Barlow-Bold",
  },
  extraBold: {
    fontSize: "16px",
    fontWeight: 700,
    fontFamily: "Barlow-ExtraBold",
  },
  textProductRow: {
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "20px",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontFamily: "Barlow-Bold",
  },
  productImageBox: {
    backgroundColor: "#D8D8D8",
    width: "65px",
    height: "86px",
    marginTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  productImage: {
    width: "inherit",
    height: "inherit",
  },
  displayFlex: {
    display: "flex",
  },
  buttonText: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#FFFFFF",
  },
  button: {
    width: 100,
    height: 30,
    color: "white",
    backgroundColor: "black",
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    borderRadius: "unset",
    "&:hover": {
      backgroundColor: "#1565C0",
    },
  },
  textRight: {
    textAlign: "right",
    fontWeight: 600,
    fontSize: "16px",
  },
  buttonIcon: {
    padding: "unset",
    color: "black",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  dividerRow: {
    margin: "12px 0px",
    backgroundColor: "#E2E2E2",
  },
  h5: {
    fontSize: "14px",
    fontWeight: "400",
  },
  regularText: {
    fontSize: "14px",
    fontWeight: "400",
  },
  textWarning: {
    fontSize: "10px",
    color: "#9B9B9B",
  },
  itemsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
}));

const OrderItemList = (props) => {
  const classes = useStyles({});
  const { order } = props;
  const [itemList, setItemList] = useState(order.order_items);
  console.log(props);
  const [orderDetail, setOrderDetail] = useState({
    ...order,
    subtotal: order?.total_sales ? order.total_sales.toFixed(2) : "0.00",
    tax: "Inclusive of 7% GST",
    shipping: order?.total_shipping ? order.total_shipping.toFixed(2) : "Free",
    discount: order?.total_discount ? order.total_discount.toFixed(2) : "0.00",
    couponCode: order?.voucher
      ? order.voucher.voucher_value.toFixed(2)
      : "0.00",
    kidztimePoints: order?.reward_point
      ? order.reward_point.transaction_value.toFixed(2)
      : "0.00",
    grandTotal: order?.net_sales ? order?.net_sales.toFixed(2) : "0.00",
  });
  const [isCollapsedDiscount, setCollapseDiscount] = useState(false);
  const handleClickShowDetail = (index) => {
    let oldData = itemList;
    oldData[index].showDetail =
      "showDetail" in oldData[index] ? !oldData[index].showDetail : true;
    setItemList([...oldData]);
  };

  const transformNegativeNumber = (value) =>
    +value === 0 ? `$${value}` : `-$${(value * -1).toFixed(2)}`;

  return (
    <Box className={classes.root} mt={5} width="100%">
      <Fragment>
        <Grid container>
          <Grid item lg={4} md={4} xs={12} sm={12}>
            <Typography className={classes.headerTable}>PRODUCT</Typography>
          </Grid>
          <Hidden mdDown>
            <Grid item lg={1} xs={2} md={2} sm={2}>
              <Typography className={classes.headerTable}>PRICE</Typography>
            </Grid>
            <Grid item lg={6} xs={3} md={4} sm={3}>
              <Typography className={classes.headerTable}>REQUEST</Typography>
            </Grid>
            <Grid item lg={1} xs={3} md={2} sm={3}>
              <Typography className={classes.headerTable}>STATUS</Typography>
            </Grid>
          </Hidden>
        </Grid>
      </Fragment>
      <Divider className={classes.Divider} />
      <Box width="100%" className={classes.itemsContainer}>
        {!itemList.length && <NotFoundPage title="No data" />}
        {itemList.map((item, index) => (
          <Fragment key={index}>
            <Grid container>
              <Grid
                item
                lg={4}
                md={4}
                xs={12}
                sm={12}
                className={classes.displayFlex}
              >
                <Grid item lg={4} xs={4} md={4} sm={4}>
                  <Box className={classes.productImageBox}>
                    {item.product?.preview && (
                      <img
                        src={item.product.preview.uri}
                        className={classes.productImage}
                        alt="design"
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item lg={8} xs={8} md={8} sm={8}>
                  <Box
                    display="flex"
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography className={classes.textProductRow}>
                      {item?.name || item?.reference}
                    </Typography>
                    <Hidden mdUp>
                      <IconButton
                        disableRipple
                        className={classes.buttonIcon}
                        aria-label="toggleVisibility"
                        onClick={() => handleClickShowDetail(index)}
                      >
                        {item.showDetail ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </Hidden>
                  </Box>
                  <Typography className={classes.h5}>
                    Design: Paw Patrol
                  </Typography>
                  <Typography className={classes.h5}>
                    Add on Caps: None
                  </Typography>
                  <Typography className={classes.h5}>
                    Add on Straw: None
                  </Typography>
                  <Hidden mdUp>
                    {item.showDetail ? (
                      <Box>
                        <Typography className={classes.textRow} mt={1}>
                          ${item?.unit_price.toFixed(2)}
                        </Typography>
                        <Typography className={classes.textRow}>
                          <span style={{ textTransform: "capitalize" }}>
                            {item.status}
                          </span>
                          <br />
                          {item.updated_at
                            ? moment(item.updated_at).format("DD / MM / YYYY")
                            : "-"}
                        </Typography>
                        <Box display="flex">
                          {item.status === "delivered" ? (
                            <>
                              <PromptRefundItem
                                buttonClassName={classes.button}
                                textClassName={classes.buttonText}
                                itemData={item}
                                disabled={false}
                              />
                              <PromptExchangeItem
                                buttonClassName={classes.button}
                                textClassName={classes.buttonText}
                                itemData={item}
                                disabled={false}
                              />
                            </>
                          ) : null}
                        </Box>
                        {item.status === "delivered" ? (
                          <Typography className={classes.textWarning}>
                            Return not available after 14 days* from the date of
                            delivery/collection
                          </Typography>
                        ) : (
                          <Typography className={classes.textRow}>
                            <span
                              style={{ textTransform: "capitalize" }}
                              className={`${classes.textRow} ${classes.extraBold}`}
                            >
                              Request - Return
                            </span>
                            <br />
                            {item.updated_at
                              ? moment(item.updated_at).format("DD / MM / YYYY")
                              : "-"}
                          </Typography>
                        )}
                      </Box>
                    ) : null}
                  </Hidden>
                </Grid>
              </Grid>
              <Hidden mdDown>
                <Grid item lg={1} xs={2} md={2} sm={2}>
                  <Typography className={classes.textRow}>
                    ${item?.unit_price.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item lg={6} xs={3} md={4} sm={3}>
                  <Box display="flex">
                    {item.status === "delivered" ? (
                      <>
                        <PromptRefundItem
                          buttonClassName={classes.button}
                          textClassName={classes.buttonText}
                          itemData={item}
                          disabled={false}
                        />
                        <PromptExchangeItem
                          buttonClassName={classes.button}
                          textClassName={classes.buttonText}
                          itemData={item}
                          disabled={false}
                        />
                      </>
                    ) : null}
                  </Box>
                  {item.status === "delivered" ? (
                    <Typography className={classes.textWarning}>
                      Return not available after 14 days* from the date of
                      delivery/collection
                    </Typography>
                  ) : (
                    <Typography className={classes.textRow}>
                      <span
                        style={{ textTransform: "capitalize" }}
                        className={`${classes.textRow} ${classes.extraBold}`}
                      >
                        Request - Return
                      </span>
                      <br />
                      {item.updated_at
                        ? moment(item.updated_at).format("DD / MM / YYYY")
                        : "-"}
                    </Typography>
                  )}
                </Grid>
                <Grid item lg={1} xs={3} md={2} sm={3}>
                  <Typography className={classes.textRow}>
                    <span style={{ textTransform: "capitalize" }}>
                      {item.status}
                    </span>
                    <br />
                    {item.updated_at
                      ? moment(item.updated_at).format("DD / MM / YYYY")
                      : "-"}
                  </Typography>
                </Grid>
              </Hidden>
            </Grid>
            <Hidden mdUp>
              {index !== itemList.length - 1 ? (
                <Divider className={classes.dividerRow} />
              ) : null}
            </Hidden>
          </Fragment>
        ))}
      </Box>
      <Divider className={classes.DividerThin} />
      <Grid container>
        <Grid item lg={8} md={8} xs={1} sm={1}></Grid>
        <Grid
          container
          item
          display="flex"
          direction="row"
          justifyContent="space-between"
          lg={4}
          xs={12}
          md={4}
          sm={11}
        >
          <Grid item lg={6} xs={6} md={6} sm={6}>
            <Typography className={`${classes.textRow} ${classes.extraBold}`}>
              SUBTOTAL
            </Typography>
          </Grid>
          <Grid item lg={6} xs={6} md={6} sm={6}>
            <Typography className={classes.textRight}>
              {orderDetail.subtotal}
            </Typography>
          </Grid>
          <Grid item lg={6} xs={6} md={6} sm={6}>
            <Typography className={`${classes.textRow} ${classes.extraBold}`}>
              TAX
            </Typography>
          </Grid>
          <Grid item lg={6} xs={6} md={6} sm={6}>
            <Typography className={classes.textRight}>
              {orderDetail.tax}
            </Typography>
          </Grid>
          <Grid item lg={6} xs={6} md={6} sm={6}>
            <Typography className={`${classes.textRow} ${classes.extraBold}`}>
              SHIPPING
            </Typography>
          </Grid>
          <Grid item lg={6} xs={6} md={6} sm={6}>
            <Typography className={classes.textRight}>
              {orderDetail.shipping}
            </Typography>
          </Grid>
          <Grid item lg={6} xs={6} md={6} sm={6}>
            <Box display="flex">
              <IconButton
                disableRipple
                className={classes.buttonIcon}
                aria-label="toggleVisibility"
                onClick={() => setCollapseDiscount(!isCollapsedDiscount)}
                edge="end"
              >
                <Typography
                  className={`${classes.textRow} ${classes.extraBold}`}
                >
                  DISCOUNT
                </Typography>
                {isCollapsedDiscount ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Grid>
          <Grid item lg={6} xs={6} md={6} sm={6}>
            <Typography className={`${classes.textRight} ${classes.extraBold}`}>
              {transformNegativeNumber(orderDetail.discount)}
            </Typography>
          </Grid>
          {isCollapsedDiscount && (
            <Fragment>
              <Grid item lg={6} xs={6} md={6} sm={6}>
                <Typography className={classes.h5}>Coupon code</Typography>
              </Grid>
              <Grid item lg={6} xs={6} md={6} sm={6}>
                <Typography
                  className={`${classes.textRight} ${classes.regularText}`}
                >
                  {transformNegativeNumber(orderDetail.couponCode)}
                </Typography>
              </Grid>
              <Grid item lg={6} xs={6} md={6} sm={6}>
                <Typography className={classes.h5}>Kidztime points</Typography>
              </Grid>
              <Grid item lg={6} xs={6} md={6} sm={6}>
                <Typography
                  className={`${classes.textRight} ${classes.regularText}`}
                >
                  {transformNegativeNumber(orderDetail.kidztimePoints)}
                </Typography>
              </Grid>
            </Fragment>
          )}
          <Grid item lg={6} xs={6} md={6} sm={6} style={{ marginTop: "12px" }}>
            <Typography className={classes.extraBold}>GRAND TOTAL</Typography>
          </Grid>
          <Grid item lg={6} xs={6} md={6} sm={6} style={{ marginTop: "12px" }}>
            <Typography className={`${classes.textRight} ${classes.extraBold}`}>
              ${orderDetail.grandTotal}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderItemList;
