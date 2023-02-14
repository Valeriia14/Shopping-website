import { Box, Grid, Typography, Stepper, Step, StepLabel, StepContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { BaseButton } from "@ktwebsite/components";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles((theme) => ({
  addressHeaderText: {
    fontSize: "14px",
    fontWeight: "bold",
    marginTop: theme.spacing(1)
  },
  addressNameText: {
    fontSize: "14px",
    marginTop: theme.spacing(1)
  },
  addressDetailText: {
    fontSize: "14px",
    marginTop: theme.spacing(1)
  },
  addressPostalText: {
    fontSize: "14px",
    marginTop: theme.spacing(1)
  },
  addressPhoneText: {
    fontSize: "14px",
    marginTop: theme.spacing(1)
  },
  addressPromoHeaderText: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#067DFF",
    marginTop: theme.spacing(1)
  },
  addressPromoText: {
    fontSize: "14px",
    color: "#067DFF",
    marginTop: theme.spacing(1)
  },
  greenIcon: {
    color: "#1CB372"
  },
  greyIcon: {
    color: "#979797"
  }
}));


const OrderStatus = props => {
  const classes = useStyles();
  const { detail } = props;
  const getSteps = () => {
    return ['processing', 'processed', 'shipped', 'completed'];
  }
  const steps = getSteps();

  const activeStep = steps.indexOf(detail.status);

  const getIconComp = (index, activeStep) => {
    if (index <= activeStep) return () => <FiberManualRecordIcon className={classes.greenIcon} />
    else return () => <FiberManualRecordIcon className={classes.greyIcon} />
  }

  return (
    <Box>
      <Typography>Order Status: {detail.status}</Typography>

      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={getIconComp(index, activeStep)}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box mt={2} borderTop="1px solid rgba(45,40,102,.1)">
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12}>
            <Typography className={classes.addressHeaderText}>SHIPPING ADDRESS - STANDARD</Typography>
            <Typography className={classes.addressNameText}>{detail?.customer_name? detail.customer_name : "-"}</Typography>
            <Typography className={classes.addressDetailText}>{detail?.shipping_address? detail.shipping_address : "-"}</Typography>
            <Typography className={classes.addressPostalText}>Singpaore {detail?.postal_code? detail.postal_code : "-"}</Typography>
            <Typography className={classes.addressPhoneText}>+{detail?.phone_number? detail.phone_number : "-"}</Typography>
            <Typography className={classes.addressPromoHeaderText}>CART PROMOTION</Typography>
            <Typography className={classes.addressPromoText}>Your cart qualified for a free eco-sipper. Enjoy your gift</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default OrderStatus;
