import {
  Box,
  Typography,
  Radio,
  Divider,
  Container,
  Button,
  Fade,
  Collapse,
  Link,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect, Fragment, useMemo } from "react";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import useApi from "@ktwebsite/utils/api/useApi";
import doRedirect from "@ktwebsite/utils/doRedirect";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { calSubtotal } from "@ktwebsite/utils/fomatting/calculate";
import { cashFormat } from "@ktwebsite/utils/fomatting/diffFormats";
import { parseNumber } from "@ktwebsite/utils/strings/generators";
import BigNumber from "bignumber.js";
import ShippingAddress from "./ShippingAddress";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "396px",
    backgroundColor: "#FAF8F3",
    boxShadow: "5px 6px 2px 0px #f1f1f1",
    padding: theme.spacing(3, 3),
    border: "1px solid #00000036",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
    "&::after": {
      left: "-1px",
      width: "396px",
      bottom: "-24px",
      height: "25px",
      content: "''",
      position: "absolute",
      background:
        "radial-gradient(circle,transparent,transparent 50%,#faf8f3  0%,#faf8f3  100%) 2px 0px / 39px 47px repeat-x",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        bottom: "-20px",
        height: "23px",
        background:
          "radial-gradient(circle,transparent,transparent 50%,#faf8f3  55%,#faf8f3  100%) 2px -1px / 38px 50px repeat-x",
      },
    },
    "&::before": {
      left: "4px",
      width: "396px",
      bottom: "-30px",
      height: "25px",
      content: "''",
      position: "absolute",
      background:
        "radial-gradient(circle,transparent,transparent 50%,#f1f1f1  0%,#f1f1f1  100%) 2px 0px / 39px 47px repeat-x",
      [theme.breakpoints.down("xs")]: {
        left: "6px",
        width: "100%",
        bottom: "-25px",
        height: "23px",
        background:
          "radial-gradient(circle,transparent,transparent 50%,#f1f1f1  55%,#f1f1f1  100%) 2px -1px / 38px 50px repeat-x",
      },
    },
  },
  title: {
    marginBottom: theme.spacing(2),
    fontSize: "30px",
    fontWeight: 700,
    lineHeight: "28px",
    textAlign: "center",
  },
  subTitle: {
    marginBottom: theme.spacing(2),
    fontSize: "20px",
    fontWeight: 500,
    lineHeight: "26px",
    textAlign: "center",
    "& .orderID": {
      color: "#1E3A3A",
      fontWeight: 600,
    },
    "& .detailLink": {
      color: "#1E3A3A",
      fontWeight: 600,
      borderBottom: "2px solid #1E3A3A",
      borderRadius: "0px",
    },
  },
  button: {
    fontSize: "16px",
    fontWeight: "bold",
    lineHeight: "19px",
    textAlign: "center",
    borderBottom: "2px solid",
    borderRadius: "0px",
  },
  titleWidget: {
    fontSize: "20px",
    fontWeight: 800,
    lineHeight: "24px",
    textAlign: "left",
    paddingLeft: "10px",
  },
  imgMenu: {
    marginBottom: theme.spacing(3),
  },
  cartProductWrap: {
    display: "flex",
    flexDirection: "row",
    padding: "20px",
    justifyContent: "flex-start",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginLeft: "0px",
    },
  },
  cartProductImgBox: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "90px",
    width: "90px",
    [theme.breakpoints.down("xs")]: {
      padding: "2px",
    },
    "& img": {
      background: "#fff",
    },
  },
  cartProductImg: {
    height: "90px",
  },
  cartProductNameBox: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  hr: {
    width: "100%",
  },
  cardProductName: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  cartProductQty: {
    fontSize: "14px",
    lineHeight: "20px",
  },
  textBold: {
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: "20px",
    textAlign: "left",
  },
  textSub: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "18px",
    textAlign: "left",
    color: "#333333",
  },
  textInfoShipping: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "20px",
    textAlign: "left",
  },
  totalSummaryBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0px!important",
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
  orderTotalBox: {
    borderTop: "1px solid #000000",
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
    flexDirection: "column",
    alignItems: "center",
  },
  pointRewardText: {
    fontSize: "14px",
    fontWeight: 500,
    marginTop: theme.spacing(1),
  },
  bodyText: {
    fontSize: "16px",
    fontWeight: 500,
  },
  subtotal: {
    fontSize: "20px",
    fontWeight: 700,
  },
  boxWidget: {
    borderBottom: "3px solid #000000",
    paddingBottom: theme.spacing(3),
  },
  ul: {
    display: "flex",
    flexDirection: "row",
    listStyleType: "none",
    width: "max-content",
    position: "absolute",
    bottom: "-40px",
    left: "-39px",
    [theme.breakpoints.down("xs")]: {
      bottom: -36,
    },
    "& li": {
      width: "29px",
      border: "1px solid #00000036",
      height: "16px",
      margin: "0 5px",
      position: "relative",
      borderBottom: "0",
      borderTopLeftRadius: "100px",
      borderTopRightRadius: "100px",
      [theme.breakpoints.down("xs")]: {
        width: "28px",
      },
      "&::before": {
        content: "''",
        position: "absolute",
        width: "11px",
        height: "1px",
        backgroundColor: "#00000036",
        bottom: "-1px",
        right: "-11px",
        [theme.breakpoints.down("xs")]: {
          right: "-6px",
          width: "6px",
        },
      },
      "&::after": {
        [theme.breakpoints.down("xs")]: {
          content: "''",
          position: "absolute",
          height: "1px",
          backgroundColor: "#00000036",
          bottom: "-1px",
          right: "-12px",
          width: "6px",
        },
      },
    },
  },
  borderLeft: {
    width: "1px",
    position: "absolute",
    height: "24px",
    backgroundColor: "#00000036",
    bottom: "-23px",
    left: "-1px",
    zIndex: 10,
    [theme.breakpoints.down("xs")]: {
      bottom: "-20px",
      height: "23px",
    },
  },
  borderRight: {
    right: "-1px",
    bottom: "-24px",
    height: "25px",
    zIndex: 10,
    width: "1px",
    position: "absolute",
    backgroundColor: "#00000036",
    [theme.breakpoints.down("xs")]: {
      bottom: "-20px",
      height: "23px",
    },
  },
  borderBottom: {
    left: "-1px",
    width: "7px",
    bottom: "-24px",
    height: "1px",
    zIndex: 10,
    position: "absolute",
    backgroundColor: "#00000036",
    [theme.breakpoints.down("xs")]: {
      width: "8px",
      bottom: "-21px",
    },
  },
  lastLi: {
    "&::after": {
      [theme.breakpoints.down("xs")]: {
        width: "0px!important",
      },
    },
  },
}));

const CheckOutBody = (props) => {
  const classes = useStyles({});
  const api = useApi();
  const [isCollapsedDiscount, setCollapseDiscount] = useState(false);
  const [model, setModel] = useState(null);
  const [showAddress, setShowAddress] = useState(true);
  useEffect(() => {
    if(model){
      setShowAddress(model?.shipping_order?.delivery_address);
    }
  }, [model]);
  const [getOrderDetails, getOrderDetailLoading, getOrderDetailError] =
    useAsyncTask("getOrderDetails");

  useEffect(() => {
    if (typeof getOrderDetails !== "function") {
      return;
    }
    const order_id = window?.location?.pathname?.slice(7, 9);
    const sessionToken = localStorage.getItem("sessionToken");

    if (order_id || sessionToken) {
      getOrderDetails(async () => {
        const response = await api.path("order/detail", { order_id }).get();
        const detail = response.data.result.model
          ? response.data.result.model
          : [];
        setModel(detail);
      });
    }
  }, []);

  return (
    <Fragment>
      <Container maxWidth="sm">
        <Box
          pb="50px"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography className={classes.title}>
            Thank you for your purchase with Kidztime!
          </Typography>
          <Typography className={classes.subTitle}>
            Here’s your{" "}
            <span className="orderID">order ID #{model?.reference || "_"}</span>
            , you can track your parcel{" "}
            <Link color="inherit" href={"#"} className="detailLink">
              here
            </Link>
            . Please free to contact us if you require any assistance.
          </Typography>
          <Button
            onClick={() => {
              doRedirect("/");
            }}
            className={classes.button}
          >
            CONTINUE SHOPPING
          </Button>
        </Box>
      </Container>
      <Container maxWidth="xs">
        <Box
          mb={5}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
        >
          <Box className={classes.container}>
            <Box display="flex" className={classes.boxWidget}>
              <img src="/images/close_box.svg" alt="" />
              <Typography className={classes.titleWidget}>
                ORDER ID #{model?.reference || "_"}
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexDirection="column"
            >
              {model?.order_items?.map((item, index) => (
                <Fragment key={index}>
                  <Box className={classes.cartProductWrap}>
                    <Box className={classes.cartProductImgBox}>
                      <img
                        src={
                          item?.product?.preview?.uri ||
                          "/images/placeholder.png"
                        }
                        className={classes.cartProductImg}
                      />
                    </Box>
                    <Box ml={4}>
                      <Box className={classes.cartProductNameBox}>
                        <Typography
                          variant="body1"
                          className={classes.cardProductName}
                        >
                          {item?.product?.name}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography className={classes.cartProductQty}>
                          Design:
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Divider className={classes.hr} />
                </Fragment>
              ))}
            </Box>
            <Box p="20px 0px">
              <Typography className={classes.textBold}>
                Special instructions for your order
              </Typography>
              <Typography className={classes.textSub}>-NIL-</Typography>
            </Box>
            <Divider />
            {showAddress && (
              <ShippingAddress
                classes={classes}
                addressSelected={model?.shipping_order}
              />
            )}
            <Box pt="20px" className={classes.totalSummaryBox}>
              <Typography variant="body1" className={classes.totalSummaryText}>
                SUBTOTAL:
              </Typography>
              <Typography variant="body1" className={classes.subtotal}>
                {cashFormat(model?.total_sales)}
              </Typography>
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
                {cashFormat(model?.shipping_order?.delivery_price || 0)}
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              p="4px 0px!important"
              onClick={() => setCollapseDiscount(!isCollapsedDiscount)}
            >
              <Box p="4px 0px!important" display="flex">
                <Typography
                  variant="body1"
                  className={classes.totalSummaryText}
                >
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
                -{cashFormat(-model?.total_discount || 0)}
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
                  -{cashFormat(model?.voucher?.voucher_value || 0)}
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
                  -{cashFormat(-model?.reward_point?.transaction_value || 0)}
                </Typography>
              </Box>
            </Collapse>
            <Box className={classes.orderTotalBox}>
              <Typography variant="body1" className={classes.orderTotalText}>
                TOTAL
              </Typography>
              <Typography variant="body1" className={classes.orderTotalText}>
                {cashFormat(model?.net_sales)}
              </Typography>
            </Box>
            <Box className={classes.pointRewardBox}>
              <Box>
                <img src="/images/Confetti.svg" alt="" />
              </Box>
              <Typography variant="body1" className={classes.pointRewardText}>
                You will earn <b>{Math.round(model?.net_sales || 0)}</b> points for
                this purchase
              </Typography>
            </Box>
            <ul className={classes.ul}>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li className={classes.lastLi}></li>
            </ul>
            <Box className={classes.borderLeft}></Box>
            <Box className={classes.borderRight}></Box>
            <Box className={classes.borderBottom}></Box>
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
};

export default CheckOutBody;
