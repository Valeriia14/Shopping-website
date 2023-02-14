import {
  Box,
  FormControl,
  IconButton,
  makeStyles,
  Typography,
  OutlinedInput,
  Button
} from "@material-ui/core";
import React, { useState } from "react";
import { Switch } from "@ktwebsite/components";
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const Coupon = (props) => {
  const {} = props;
  const [coupon, setCoupon] = useState(null);

  const classes = useStyles();

  return (
    <FormControl className={classes.couponForm} >
      <Box className={classes.containerBoxTitle}>
        <Typography variant="h3" className={classes.orderSummaryHeaderPoints}>COUPON</Typography>
      </Box>
      <Box className={classes.containerBoxInput}>
        {!coupon && (
          <>
            <OutlinedInput
              id="coupon-input"
              className={classes.pointsInput}

              onChange={e => {}}
              placeholder={"Enter Gift / Promo Code"}
            />
            <Button className={classes.couponSubmit} onClick={() => setCoupon({})}>
              <TrendingFlatIcon/>
            </Button>
          </>
        )}
        {coupon && (
          <>
            <DeleteOutlineIcon className={classes.removeCoupon} onClick={() => setCoupon(null)}/>
            <Typography variant="h3" className={classes.couponName}>FREE5DOLLARS</Typography>
            <Typography variant="h3" className={classes.couponDiscount}>-$5.00</Typography>
          </>
        )}
      </Box>
      <Typography variant="h3" className={classes.info}>Limited one code per order</Typography>
    </FormControl>
  );
}

const useStyles = makeStyles(theme => ({
  couponForm:{
    borderTop: "1px solid #BDBDBD",
    width: "100%",
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  orderSummaryHeaderPoints: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#000000",
  },
  containerBoxTitle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerBoxInput: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    height: "40px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    fontSize: "10px",
    fontWeight: "500",
    color: "#1E3A3A",
  },
  pointsInput: {
    borderRadius: "0px",
    height: "100%",
    width: "100%",
    fontSize: "14px",
    fontWeight: "500",
    "& input": {
      padding: "10px 14px",
     borderRadius: "0px",
    }
  },
  couponSubmit: {
    background: "black",
    color: "white",
    borderRadius: "0px",
    height: "100%",
    minWidth: "40px",
    "&:hover": {
      background: "black"
    }
  },
  couponName: {
    fontSize: "16px",
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
  },
  couponDiscount: {
    fontSize: "16px",
  },
  removeCoupon: {
    cursor: "pointer",

  }
}))

export default Coupon;
