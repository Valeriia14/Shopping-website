import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  Hidden,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { Fragment, useMemo } from "react";
import CloseIcon from "@material-ui/icons/Close";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { OrderListItems } from "./components";
import { useCart } from "@ktwebsite/hooks";
import { cashFormat } from "@ktwebsite/utils/fomatting/diffFormats";
import { calSubtotal } from "@ktwebsite/utils/fomatting/calculate";
import { IconComponent } from "@ktwebsite/components";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 535,
    overflow: "hidden",
    position: "relative",
    backgroundColor:"#F9F8F4",
    [theme.breakpoints.down("sm")]: {
      minWidth: "auto",
      width: "100vw",
    },
  },
  button: {
    border: '1px solid #000000',
    boxSizing: 'border-box',
    marginRight: '30px',
    padding: 0,
    minWidth: "fit-content",
    height: "fit-content",
    marginTop: 4,
    [theme.breakpoints.down("sm")]: {
      marginRight: '22px',
    },
  },
  dividerShipping: {
    height: 10,
    backgroundColor: "#1E3A3A",
    borderRadius: "11px",
  },
  shippingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F8F4",
    padding: "16px 30px",
    [theme.breakpoints.down("xs")]: {
      padding: "22px 20px",
    },
  },
  subtotalBox: {
    backgroundColor: "#DEDCD0",
    paddingTop: "16px!important",
    padding: "30px",
    bottom: 0,
    [theme.breakpoints.down("xs")]: {
      padding: "22px 20px",
      boxShadow: "1px 1px 11px #0000006e",
      backgroundColor: "white",
      position: "fixed",
      width: "100vw",
      bottom: 0,
    },
  },
  lineBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewCartButton: {
    width: "100%",
    fontSize: "18px",
    fontFamily: "Barlow-medium",
    borderRadius: 0,
    border: "2px solid",
  },
  checkOutButton: {
    padding: "8px",
    color: "white",
    fontSize: "18px",
    fontFamily: "Barlow-medium",
    borderRadius: 0,
    backgroundColor: "black",
    width: "100%",
    "&.Mui-disabled": {
      color: "#ffffff",
      backgroundColor: "gray",
    },
  },
  primaryTitle: {
    fontSize: "25px",
    fontWeight: "bold",
    margin: "30px",
    lineHeight: '30px',
    textTransform: 'uppercase',
    [theme.breakpoints.down("xs")]: {
      fontSize: 24,
    },
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 700,
  },
  contentFooter: {
    fontSize: 16,
    fontWeight: 500,
  },
  freeShipText: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: "28px",
    textAlign: "center"
  },
  textSubtotal: {
    fontSize: 16,
  },
  dividerFooter: {
    margin: "16px 0px",
    backgroundColor: "#000000",
  },
  dividerCart:{
    margin: "0px 30px",
    backgroundColor: "#000000",
    height: "3px",
    [theme.breakpoints.down("sm")]: {
      marginRight: '22px',
    },
  },
  freeShipIcon:{
    margin: "-5px 10px"
  },
  progress:{
    width: "100%",
    borderRadius: "11px",
    border: "1px solid #1E3A3A",
    margin:"14px 0px"
  }
}));

const DrawerRight = (props) => {
  const { open, onToggle } = props;
  const classes = useStyles();
  const [cart] = useCart();

  const total = useMemo(() => {
    if (cart) {
      return cashFormat(
        (calSubtotal(cart?.cart_items) || 0) + (cart?.shipping || 0)
      );
    } else return "-";
  }, [cart]);

  const toCart = () => {
    doRedirect("/cart");
  };
  return (
    <Drawer anchor="right" open={open} onClose={(e) => onToggle(e)}>
      <Box className={classes.root} role="presentation">
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography className={classes.primaryTitle} variant="h4">
              MY CART ( {cart?.cart_items?.length} Items )
            </Typography>
            <Button onClick={(e) => onToggle(e)} className={classes.button}>
              <CloseIcon fontSize="small"/>
            </Button>
          </Box>
          <Divider className={classes.dividerCart} />
          <Box className={classes.shippingBox}>
            <Typography variant="h6" className={classes.freeShipText}>
              <IconComponent name="freeShippingIcon" className={classes.freeShipIcon}/>
              {
                calSubtotal(cart?.cart_items) >= 30 ? <Fragment>You get <b>FREE</b> shipping!</Fragment> : <Fragment><b>{cashFormat(30 - calSubtotal(cart?.cart_items))}</b> more to enjoy <b>FREE</b> shipping!</Fragment>
              }
            </Typography>
            <Box className={classes.progress}>
              <Box className={classes.dividerShipping} style={{width:`${parseInt(((calSubtotal(cart?.cart_items) > 30 ? 30 : calSubtotal(cart?.cart_items))/30)*100)}%`}}></Box>
            </Box>
          </Box>
        </Box>
        <OrderListItems total={total} />
        <Box className={classes.subtotalBox}>
          <Hidden xsDown={true}>
            <Box className={classes.lineBox}>
              <Typography className={classes.footerTitle}>SUBTOTAL</Typography>
              <Typography className={classes.textSubtotal}>
                <b>{cashFormat(calSubtotal(cart?.cart_items))}</b>
              </Typography>
            </Box>
            <Box className={classes.lineBox}>
              <Typography className={classes.footerTitle}>TAX</Typography>
              <Typography className={classes.contentFooter}>
                Inclusive of 7% GST
              </Typography>
            </Box>
            <Box className={classes.lineBox}>
              <Typography className={classes.footerTitle}>SHIPPING</Typography>
              <Typography className={classes.contentFooter}>
              {calSubtotal(cart?.cart_items) >= 30 ? cashFormat(0) : cart?.shipping
                            ? cashFormat(cart?.shipping)
                            : "Not yet Calculated"}
              </Typography>
            </Box>
            <Divider className={classes.dividerFooter} />
            <Box className={classes.lineBox}>
              <Typography className={classes.footerTitle}>TOTAL</Typography>
              <Typography className={classes.textSubtotal}>
                <b>{total}</b>
              </Typography>
            </Box>
          </Hidden>
          <Box margin="14px 0px">
            <Grid container spacing={2}>
              <Grid xs={6} item>
                <Button
                  onClick={() => {
                    localStorage.setItem("prevUrl", window.location.pathname);
                    toCart();
                  }}
                  disabled={
                    cart?.cart_items?.length <= 0 || !cart?.cart_items?.length
                  }
                  className={classes.viewCartButton}
                >
                  VIEW CART
                </Button>
              </Grid>
              <Grid xs={6} item>
                <Button
                  onClick={() => {
                      localStorage.setItem("prevUrl", window.location.pathname);
                      doRedirect("/cart?select_all=true");
                  }}
                  disabled={
                    cart?.cart_items?.length <= 0 || !cart?.cart_items?.length
                  }
                  className={classes.checkOutButton}
                >
                  CHECKOUT
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default DrawerRight;
