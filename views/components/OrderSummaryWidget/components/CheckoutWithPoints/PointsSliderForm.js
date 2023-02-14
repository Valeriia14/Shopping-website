import { Box, FormControl, makeStyles, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Switch } from "@ktwebsite/components";
import useApi from "@ktwebsite/utils/api/useApi";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import { cashFormat } from "@ktwebsite/utils/fomatting/diffFormats";

const PointsSliderForm = (props) => {
  const {
    setPointsToUse,
    pointsErrorText,
    sliderDisabled,
    isError,
    disabled,
    checkDisabled,
  } = props;

  const classes = useStyles();
  const api = useApi();
  const [runFetchPoints, loadingFetchPoints, errorFetchPoints] =
    useAsyncTask("fetchPoints");
  const [useRedeemPoint, setUseRedeemPoint] = useState(false);
  const [availablePoint, setAvailablePoint] = useState(0);
  const [availablePointValue, setAvailablePointValue] = useState(0);
  let cart_session =
    typeof window === "undefined" ? null : JSON.parse(sessionStorage.getItem("cart"));

  const handleSliderChange = (event, newValue) => {
    setPointsToUse(Number(newValue));
  };

  useEffect(() => {
    runFetchPoints(async () => {
      const res = await api.path("public/reward_point/available").get();
      setAvailablePoint(res?.data?.result?.models?.point_sum || 0);
      setAvailablePointValue(res?.data?.result?.models?.value_sum || 0);
    });
  }, [availablePoint, availablePointValue]);

  return (
    <FormControl disabled={sliderDisabled} className={classes.sliderForm}>
      <Box className={classes.kidztimeRewardPointBox}>
        <Typography variant="h3" className={classes.orderSummaryHeaderPoints}>
          REDEEM KIDZTIME POINTS
        </Typography>
        {!disabled && (
          <Switch
            disabled={availablePoint === 0 || checkDisabled}
            checked={useRedeemPoint}
            onChange={(e) => {
              setUseRedeemPoint(!useRedeemPoint);
              if (!useRedeemPoint) {
                handleSliderChange(e, availablePoint);
              } else {
                handleSliderChange(e, 0);
              }
            }}
            name="redeem_points"
          />
        )}
      </Box>
      {!disabled ? (
        <Box className={classes.kidztimeRewardPoints}>
          <Typography
            variant="h3"
            className={
              useRedeemPoint || disabled
                ? classes.orderSummaryTotalPointsActive
                : classes.orderSummaryTotalPoints
            }
          >
            {availablePoint} Points
          </Typography>
          <Typography
            variant="h3"
            className={
              useRedeemPoint || disabled
                ? classes.orderSummaryTotalPointsActive
                : classes.orderSummaryTotalPoints
            }
          >
            -${availablePointValue.toFixed(2)}
          </Typography>
        </Box>
      ) : (
        <Box className={classes.kidztimeRewardPoints}>
          <Typography
            variant="h3"
            className={
              useRedeemPoint || disabled
                ? classes.orderSummaryTotalPointsActive
                : classes.orderSummaryTotalPoints
            }
          >
            {cart_session.pointsCanUse*10} Points
          </Typography>
          <Typography
            variant="h3"
            className={
              useRedeemPoint || disabled
                ? classes.orderSummaryTotalPointsActive
                : classes.orderSummaryTotalPoints
            }
          >
            -{cashFormat(cart_session.pointsCanUse)}
          </Typography>
        </Box>
      )}
      <Box>
        {isError && (
          <Typography variant="body1" className={classes.promoCodeText}>
            {pointsErrorText}
          </Typography>
        )}
      </Box>
    </FormControl>
  );
};

const useStyles = makeStyles((theme) => ({
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
    color: theme.palette.secondary.main,
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
}));

export default PointsSliderForm;
