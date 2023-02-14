import {
  Box,
  FormControl,
  IconButton,
  makeStyles,
  OutlinedInput,
  Slider,
  Typography,
  Collapse,
} from "@material-ui/core";
import React, { useState, useEffect, useApi } from "react";
import { Switch } from "@ktwebsite/components";

const PointsSliderForm = (props) => {
  const {
    handlePointsChange,
    handlePointsDecrease,
    handlePointsIncrease,
    setPointsToUse,
    pointsErrorText,
    sliderDisabled,
    pointsToUse,
    userPointsTotal,
    amountToRedeem,
    sliderMax,
    isError,
  } = props;

  const classes = useStyles();
  const api = useApi()
  const [useRedeemPoint, setUseRedeemPoint] = useState(false);
  const [availablePoint, setAvailablePoint] = useState(0);
  const [availablePointValue, setAvailablePointValue] = useState(0);

  const handleSliderChange = (event, newValue) => {
    setPointsToUse(Number(newValue));
  };

  useEffect(() => {
    const res = await api.path("public/reward_point/available").get();
    setAvailablePoint(res?.data?.result?.models?.point_sum || 0);
    setAvailablePointValue(res?.data?.result?.models?.point_value || 0);
  }, [availablePoint, availablePointValue]);

  return (
    <FormControl disabled={sliderDisabled} className={classes.sliderForm} >
      <Box className={classes.kidztimeRewardPointBox}>
        <Typography variant="h3" className={classes.orderSummaryHeaderPoints}>REDEEM KIDZTIME POINTS</Typography>
        <Switch checked={useRedeemPoint} onChange={() => setUseRedeemPoint(!useRedeemPoint)} name="redeem_points" />
      </Box>
      <Box className={classes.kidztimeRewardPoints}>
        <Typography variant="h3" className={useRedeemPoint ? classes.orderSummaryTotalPointsActive : classes.orderSummaryTotalPoints}>{availablePoint} Points</Typography>
        <Typography variant="h3" className={useRedeemPoint ? classes.orderSummaryTotalPointsActive : classes.orderSummaryTotalPoints}>-${availablePointValue.toFixed(2)}</Typography>
      </Box>
      <Box>
        {isError && <Typography variant="body1" className={classes.promoCodeText}>{pointsErrorText}</Typography>}
      </Box>
    </FormControl>
  );
}

const useStyles = makeStyles(theme => ({
  orderSummaryHeaderPoints: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#000000",
  },
  kidztimeRewardPointBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kidztimeRewardPoints: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderSummaryTotalPoints: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#D9D8D8",
  },
  orderSummaryTotalPointsActive: {
    fontSize: "16px",
    fontWeight: "700",
  },
  promoCodeText: {
    fontSize: "16px",
    fontWeight: 500,
    color: theme.palette.secondary.main
  },
  promoCodeSlider: {
    color: theme.palette.secondary.main,
  },
  sliderForm: {
    display: "flex",
    borderTop: "1px solid #BDBDBD",
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),

  },
}))

export default PointsSliderForm;
