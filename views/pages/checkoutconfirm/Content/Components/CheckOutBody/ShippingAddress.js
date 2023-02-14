import { Box, Divider, Typography } from "@material-ui/core";
import React, { Fragment } from "react";

const ShippingAddress = (props) => {
  const { classes, addressSelected } = props;
  return (
    <Fragment>
      <Box p="20px 0px">
        <Typography className={classes.textBold}>Standard Courier</Typography>
        <Typography className={classes.textBold}>
          Delivers in 3-5 business days*
        </Typography>
        <Typography className={classes.textBold}>
          Preferred timing - Anytime
        </Typography>
        <Typography className={classes.textInfoShipping}>
          {addressSelected?.delivery_address || "-"}
        </Typography>
        {/* <Typography className={classes.textInfoShipping}>
          {"#" +
            addressSelected?.unit_no.slice(0, 2) +
            "-" +
            addressSelected?.unit_no.slice(2, 4) || "-"}
        </Typography> */}
        <Typography className={classes.textInfoShipping}>
          {/* {(addressSelected?.country || "-") +
            " " + */}
          {
            (addressSelected?.delivery_postal || "-")
          }
        </Typography>
      </Box>
      <Divider />
    </Fragment>
  );
};

export default ShippingAddress;
