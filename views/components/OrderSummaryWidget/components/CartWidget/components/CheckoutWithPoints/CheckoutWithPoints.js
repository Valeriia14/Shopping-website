import { useCart, useSelfAccount } from "@ktwebsite/hooks";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import PointsSliderForm from './PointsSliderForm';
import PublicPointsBox from './PublicPointsBox';

const CheckoutWithPoints = (props) => {
  const { children, className, onChangePoints, ...rest } = props;
  const classes = useStyles();
  const [cart] = useCart();
  const self = useSelfAccount();

  const [userPointsTotal, setUserPointsTotal] = useState(0);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [amountToRedeem, setAmountToRedeem] = useState(0)
  const [ratio, setRatio] = useState(0);
  const [sliderMax, setSliderMax] = useState(10);
  const [pointsErrorText, setPointsErrorText] = useState('');
  const [sliderDisabled, setSliderDisabled] = useState(false);
  const [isError, setIsError] = useState(false);
  const [newTotal, setNewTotal] = useState(0);

  useEffect(() => {
    if (typeof getPoints !== 'function') {
      return;
    };
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      getPoints(async () => {
        const res = await api.path("public/reward_point/available").get();
        const resPoints = res?.data?.result?.models?.point_sum || 0;
        setUserPointsTotal(Number(resPoints));
        if (resPoints === 0) {
          setSliderDisabled(true)
        }
        setRatio(0)
        const isLoggedInUser = self ? true : false;
        setLoggedIn(isLoggedInUser)
      })
    }
  }, []);

  useEffect(() => {
    const pointsMax = (Number(cart.subtotal) - Number(cart.discount)) / Number(ratio);
    if (pointsMax > userPointsTotal) {
      setSliderMax(userPointsTotal);
    } else {
      setSliderMax(pointsMax);
    }
    if (cart.total)
      setNewTotal(cart.total);
  }, [ratio, cart])

  useEffect(() => {
    const pointsDiscount = pointsToUse * ratio;
    const orderDiscount = Number(pointsDiscount.toFixed(2));
    const orderPreTotal = cart.subtotal - cart.discount - orderDiscount;
    const preTotalToNumber = Number(orderPreTotal.toFixed(2));
    if (preTotalToNumber < 1 && preTotalToNumber > 0) {
      setPointsErrorText("The order total must be at least $1 or totally $0");
      setIsError(true);
      setNewTotal(preTotalToNumber);
    } else {
      setSliderDisabled(false);
      setIsError(false);
      setPointsErrorText('');
      setNewTotal(preTotalToNumber);
    }
    setAmountToRedeem(orderDiscount);
    if (!cart.subtotal) {
      setIsError(true);
      setSliderDisabled(true);
    }
  }, [pointsToUse, ratio, cart])

  const handlePointsChange = (value) => {
    const pointsMax = (Number(cart.subtotal) - Number(cart.discount)) / Number(ratio);
    if (value <= pointsMax) {
      setPointsToUse(value);
      setIsError(false);
      setPointsErrorText('');
    } else {
      setPointsErrorText("Number of points can't exceed the total cost of the order");
      setIsError(true);
    }
  }

  const handlePointsIncrease = () => {
    const pointsMax = (Number(cart.subtotal) - Number(cart.discount)) / Number(ratio);
    const currentPointNumber = pointsToUse + 1;
    if (currentPointNumber < pointsMax) {
      setPointsToUse(currentPointNumber)
    }
  };

  const handlePointsDecrease = () => {
    const currentPointNumber = pointsToUse - 1;
    if (currentPointNumber >= 0) {
      setPointsToUse(currentPointNumber)
    }
  };

  const updateItem = useCallback((points) => {
    runUpdateItem(async () => {
      try {
        const body = { points };
        await api.path("points/update").post({ body });
      } catch (error) {
        setSnackOpen(!!error);
        setErrorMessage(ServerErrors[error.message] || snakeToTitle(error.message));
      }
    })
  }, [])
  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      {!self && (
        <PublicPointsBox />
      )}
      {!!self && (
        <PointsSliderForm
          classes={classes}
          handlePointsChange={handlePointsChange}
          handlePointsDecrease={handlePointsDecrease}
          handlePointsIncrease={handlePointsIncrease}
          setPointsToUse={setPointsToUse}
          pointsErrorText={pointsErrorText}
          sliderDisabled={sliderDisabled}
          pointsToUse={pointsToUse}
          userPointsTotal={userPointsTotal}
          amountToRedeem={amountToRedeem}
          sliderMax={sliderMax}
          isError={isError}
        />
      )}
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default CheckoutWithPoints;
