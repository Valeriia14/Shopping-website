import doRedirect from "@ktwebsite/utils/doRedirect";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment, useState } from "react";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  Box,
  Typography,
  Collapse,
  Button,
  Badge,
  Fade,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  orderSummaryBox: {
    width: "100%",
    border: "1px solid " + theme.palette.boxBorder,
    backgroundColor: "#fff",
    padding: theme.spacing(2, 3),
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  orderSummaryHeader: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#000000",
  },
  totalSummaryBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalSummaryText: {
    fontSize: "16px",
    fontWeight: 700,
  },
  editCartBtn: {
    margin: 8,
    height: "fit-content",
    borderBottom: "2px solid #000000",
    padding: "0px",
    borderRadius : 0,
    fontWeight:"bold",
    fontSize:"16px"
  },
  editCartBtnBox :{
    width: "100%",
    display: "flex",
    justifyContent: "flex-end"
  },
  cartProductSku: {
    fontSize: "14px",
    lineHeight: "20px",
  },
  cardProductName: {
    fontSize: "16px",
    fontWeight: "bold"
  },
  cartProductQty: {
    fontSize: "14px",
    lineHeight: "20px",
  },
  cartProductPriceBox: {
    display: "flex",
    flexDirection: "row",
  },
  cartProductPrice: {
    fontSize: "16px",
  },
  cartProductRrp: {
    color: "rgba(45,40,102,0.5)",
    fontSize: "12px",
    textDecoration: "line-through",
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(0.5),
  },
  cartProductWrap: {
    display: "flex",
    flexDirection: "row",
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
    width: "90px",
    height: "90px",
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
    backgroundColor: "#000000",
    marginTop: 26,
    marginBottom: 26,
    height: "3px"
  },
  badge: {
    height: "24px",
    width: "24px",
    borderRadius: "20px",
  },
  badgeColorPrimary: {
    color: "black",
    background: "white",
    border: "1px solid",
  },
  anchorOriginTopRightCircular: {
    top: "5%",
    right: "5%",
  },
  collapse : {
    width: "100%!important"
  }
}));

const CartWidget = (props) => {
  const { items, noCollapse } = props;
  const classes = useStyles({});
  const [isCollapsed, setCollapse] = useState(false);

  return (
    <Box className={!noCollapse ? classes.orderSummaryBox : ""}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => setCollapse(!isCollapsed)}
      >
        {!noCollapse && (
          <>
            <Typography variant="h3" className={classes.orderSummaryHeader}>
              MY BAG ({items.length})
            </Typography>
            {!isCollapsed && <ExpandMoreIcon />}
            {isCollapsed && (
              <Fade in={isCollapsed}>
                <ExpandLessIcon />
              </Fade>
            )}
          </>
        )}
        {noCollapse && (
          <Typography variant="h3" className={classes.orderSummaryHeader}>
            ORDER ID #{items[0]?.reference}
          </Typography>
        )}
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Collapse className={classes.collapse} in={isCollapsed || noCollapse}>
          <hr className={classes.hr} />

          {items.map((item, index) => (
            <Fragment key={index}>
              <Box className={classes.cartProductWrap}>
                <Box className={classes.cartProductImgBox}>
                    <img
                      src={item?.product?.preview?.uri || "/images/placeholder.png"}
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
            </Fragment>
          ))}
          <hr className={classes.hr} />
          {!noCollapse && (
            <Box className={classes.editCartBtnBox}>
              <Button
                className={classes.editCartBtn}
                onClick={() => doRedirect("/cart")}
              >
                EDIT CART
              </Button>
            </Box>
          )}
        </Collapse>
      </Box>
    </Box>
  );
};

export default CartWidget;
