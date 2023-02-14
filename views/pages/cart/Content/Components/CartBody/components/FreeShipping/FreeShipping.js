import { Box, makeStyles, Typography, Divider } from "@material-ui/core";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { IconComponent } from "@ktwebsite/components";
import { cashFormat } from "@ktwebsite/utils/fomatting/diffFormats";
import { calSubtotal } from "@ktwebsite/utils/fomatting/calculate";

const useStyles = makeStyles((theme) => ({
  dividerCart: {
    backgroundColor: "#000000",
    height: "3px",
  },
  freeShipIcon: {
    margin: "-5px 10px",
  },
  progress: {
    width: "100%",
    borderRadius: "11px",
    border: "1px solid #1E3A3A",
    margin: "14px 0px",
  },
  dividerShipping: {
    height: 10,
    backgroundColor: "#1E3A3A",
    borderRadius: "11px",
  },
  freeShipText: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: "28px",
    textAlign: "center",
  },
  shippingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F7F7",
    padding: "17px 0px 0px",
  },
  divider: {
    backgroundColor: "#000000",
  },
}));

const FreeShipping = (props) => {
  const classes = useStyles();
  const { isSelected, cart } = props;
  const [cartItems, setCartItems] = useState(cart.cartItems || null);
  const { subtotal } = useMemo(() => {
    const subtotal = calSubtotal(cartItems);
    return {
      subtotal,
    };
  }, [cartItems]);

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
  return (
    <Box>
      <Divider className={classes.dividerCart} />
      <Box className={classes.shippingBox}>
        <Typography variant="h6" className={classes.freeShipText}>
          <IconComponent
            name="freeShippingIcon"
            className={classes.freeShipIcon}
          />
          {subtotal >= 30 ? (
            <Fragment>
              You get <b>FREE</b> shipping!
            </Fragment>
          ) : (
            <Fragment>
              <b>{cashFormat(30 - subtotal)}</b> more to enjoy <b>FREE</b>{" "}
              shipping!
            </Fragment>
          )}
        </Typography>
        <Box className={classes.progress}>
          <Box className={classes.dividerShipping} style={{width:`${parseInt(((subtotal > 30 ? 30 : subtotal)/30)*100)}%`}}></Box>
        </Box>
      </Box>
      <Divider className={classes.divider} />
    </Box>
  );
};

export default FreeShipping;
