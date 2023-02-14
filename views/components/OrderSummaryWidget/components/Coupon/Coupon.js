import {
  Box,
  FormControl,
  IconButton,
  makeStyles,
  Typography,
  OutlinedInput,
  Button
} from "@material-ui/core";
import React, { useState, useCallback } from "react";
import { Switch } from "@ktwebsite/components";
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import useApi from '@ktwebsite/utils/api/useApi';

const Coupon = (props) => {
  const { disabled, coupon, setCoupon } = props;
  // const [coupon, setCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');
  const api = useApi()

  const classes = useStyles();

  const handleSetCoupon = useCallback(async ()=>{
    const res = await api.path("public/voucher/detail", { ref : couponCode }).get();
    setCoupon(res?.data?.result?.models)
    if (!res?.data?.result?.models) setError("Sorry, your code is not valid.")
    else setError("")
  }, [couponCode])

  return (
    <FormControl className={classes.couponForm} >
      <Box className={classes.containerBoxTitle}>
        <Typography variant="h3" className={classes.orderSummaryHeaderPoints}>COUPON CODE</Typography>
      </Box>
      <Box className={classes.containerBoxInput}>
        {!coupon && !disabled && (
          <>
            <OutlinedInput
              id="coupon-input"
              className={classes.pointsInput}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder={"Enter Gift / Promo Code"}
            />
            <Button className={classes.couponSubmit} onClick={handleSetCoupon}>
              <TrendingFlatIcon/>
            </Button>
          </>
        )}
        {!coupon && disabled && (
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Typography variant="h3" className={classes.noCouponText}>No Coupon Selected</Typography>
            <Typography variant="h3" className={classes.couponDiscount}>-$0.00</Typography>
          </Box>
        )}
        {coupon && (
          <>
            {!disabled && (
              <DeleteOutlineIcon className={classes.removeCoupon} onClick={() => setCoupon(null)}/>
            )}
            <Typography variant="h3" className={classes.couponName}>{coupon.description}</Typography>
            <Typography variant="h3" className={classes.couponDiscount}>-${coupon.voucher_value.toFixed(2)}</Typography>
          </>
        )}
      </Box>
      {error && (
        <Typography className={classes.couponError}>
          {error}
        </Typography>
      )}
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
  },
  noCouponText :{
    fontSize: "16px",
    flexGrow: 1,
    color :"#9C9A9A"
  },
  couponError: {
    color: "red"
  }
}))

export default Coupon;
