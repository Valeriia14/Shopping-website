import { Box, Typography, Divider, makeStyles } from "@material-ui/core";
import React from "react";
import { BaseButton } from "@ktwebsite/components";
import doRedirect from "@ktwebsite/utils/doRedirect";

const PublicPointsBox = (props) => {
  const classes = useStyles();

  const onSignOut = () => {
    localStorage.setItem("urlAfterSignIn", "/cart");
    doRedirect("/auth/signin");
  };
  const onSignUp = () => {
    localStorage.setItem("urlAfterSignIn", "/cart");
    doRedirect("/auth/signup");
  };

  return (
    <>
      <Box className={classes.kidztimeRewardPointBox}>
        <Typography variant="body1" className={classes.kidztimeRewardPointText}>Kidztime reward points:</Typography>
        <Typography variant="body1" className={classes.kidztimeRewardPointText}>$0.00</Typography>
      </Box>
      <Box className={classes.signUpBox}>
        <Box>
          <Typography className={classes.signUpAndGetPointText}>SIGN UP &amp; GET 40 POINTS</Typography>
          <Typography className={classes.signUpAndGetPointText}>(WORTH SGD 4)</Typography>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          <BaseButton text="SIGN UP" buttonClassName={classes.authBtn} textClassName={classes.signUpText} onClick={onSignUp} />
          <Divider orientation="vertical" variant='middle' className={classes.authDivider} />
          <BaseButton text="LOG IN" buttonClassName={classes.authBtn} textClassName={classes.logInText} onClick={onSignOut} />
        </Box>
      </Box>
    </>
  );
};

const useStyles = makeStyles(theme => ({
  kidztimeRewardPointBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kidztimeRewardPointText: {
    fontSize: "16px",
    fontWeight: 500,
    color: "#D8D8D8"
  },
  pointsInput: {
    height: "23px",
    width: "45px",
    fontSize: "16px",
    fontWeight: "400",
    color: theme.palette.secondary.main,
    "& #slider-input": {
      padding: "0 3px",
      textAlign: "center",
    }
  },
  pointsInputBox: {
    display: "flex",
  },
  pointsButtonMinus: {
    padding: '4px 12px 4px 0',
  },
  pointsButtonPlus: {
    padding: '4px 0 4px 8px',
  },
  authBtn: {
    background: "#fad1d9",
    width: "100%",
    height: "35px",
    borderRadius: "49px",
    whiteSpace: "nowrap",
  },
  authDivider: {
    "&.MuiDivider-vertical-1001": {
      height: "70%",
      color: "#dfdeea",
    },
    "& .MuiDivider-middle-1000": {
      marginLeft: "9px",
      marginRight: "9px",
    }
  },
  signUpBox: {
    display: "flex",
    flexDirection: "row",
    background: "#FFF9FD",
    padding: "10px",
    justifyContent: "space-between"
  },
  signUpAndGetPointText: {
    color: theme.palette.secondary.main,
    fontSize: "15px",
    fontWeight: "bold",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    }
  },
  signUpText: {
    color: theme.palette.secondary.main,
    fontSize: "14px",
    paddingRight: "4px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    }
  },
  logInText: {
    color: theme.palette.secondary.main,
    fontSize: "14px",
    paddingLeft: "4px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    }
  },
}))

export default PublicPointsBox;
