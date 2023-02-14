import { useSelfAccount } from "@ktwebsite/hooks";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import PointsSliderForm from './PointsSliderForm';
import PublicPointsBox from './PublicPointsBox';

const CheckoutWithPoints = (props) => {
  const { children, checkDisabled , className, onChangePoints, disabled, ...rest } = props;
  const classes = useStyles();
  const self = useSelfAccount();
  const [pointsToUse, setPointsToUse] = useState(0);
  const [pointsErrorText, setPointsErrorText] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    onChangePoints(pointsToUse);
  }, [pointsToUse]);

  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      {!self && (
        <PublicPointsBox />
      )}
      {!!self && (
        <PointsSliderForm
          disabled={disabled}
          classes={classes}
          setPointsToUse={setPointsToUse}
          pointsErrorText={pointsErrorText}
          sliderDisabled={false}
          pointsToUse={pointsToUse}
          isError={isError}
          checkDisabled={checkDisabled}
        />
      )}
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default CheckoutWithPoints;
