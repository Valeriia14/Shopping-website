import { Box, Button, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    color: "#FFFFFF",
  },
  container: {
    display: "flex",
    height: "369px",
    alignItems: "flex-end",
    flexDirection: "column",
    [theme.breakpoints.down("md")]: {
      height: "100%",
    },
  },
  flashSaleBox: {
    width: "100%",
    paddingBottom: 14,
  },
  flashSaleHeader: {
    backgroundColor: "#3E4436",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px 0px",
    "& p": {
      fontFamily: "Cormorant-SemiBold",
      fontSize: "16px",
      fontWeight: 600,
      lineHeight: "19px",
      textAlign: "center",
      padding: "0px 60px",
    },
  },
  image: {
    width: "100%",
  },
  button: {
    width: "100%",
    fontSize: "16px",
    height: "48px",
    fontWeight: 500,
    lineHeight: "19px",
    textAlign: "center",
    color: "white",
    padding: "14px 0px",
    borderRadius: 0,
    backgroundColor: "black",
    "&:hover": {
      backgroundColor: "black",
    },
  },
  contentBox: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "100%",
    padding: "50px 30px",
  },
  textHeader: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "19px",
    textAlign: "left",
    marginTop: 40,
  },
  text1: {
    fontFamily: "Cormorant-SemiBold",
    fontSize: "30px",
    fontWeight: 700,
    lineHeight: "36px",
    textAlign: "left",
    marginTop: 20,
  },
  text2: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "22px",
    textAlign: "left",
    marginTop: 6,
  },
  timeLeftDealBox: {
    width: "70%",
    borderBottom: "1px solid",
    borderRight: "1px solid",
    paddingBottom: "30px",
  },
  textDealEnding: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "30px",
    textAlign: "left",
  },
  textTimeLeft: {
    fontSize: "24px",
    fontWeight: 700,
    lineHeight: "30px",
    textAlign: "left",
  },
  textHeaderTime: {
    fontFamily: "Cormorant-SemiBold",
    fontSize: "10px",
    fontWeight: 600,
    lineHeight: "30px",
    textAlign: "left",
    position: "absolute",
  },
  day: {
    left: "1px",
    top: "26px",
  },
  hour: {
    left: "40px",
    top: "26px",
  },
  min: {
    left: "86px",
    top: "26px",
  },
  dayLeftBox: {
    width: "30%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid",
  },
  textDay: {
    fontSize: "20px",
    fontWeight: 700,
    lineHeight: "30px",
    textAlign: "left",
  },
  textYear: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "30px",
    textAlign: "left",
  },
}));

const TimeLeftBox = () => {
  const classes = useStyles();
  return (
    <Box className={classes.flashSaleBox}>
      <Box className={classes.flashSaleHeader}>
        <Typography>
          Hurry! Enjoy special discount with our flash deal promotion
        </Typography>
      </Box>
      <Box className={classes.root}>
        <img
          src="/images/deal_bg_mobile.svg"
          alt="deal_bg_mobile"
          className={classes.image}
        />
        <Box className={classes.contentBox}>
          <Box display="flex">
            <Box className={classes.timeLeftDealBox}>
              <Typography className={classes.textDealEnding}>
                Deal ending in
              </Typography>
              <Box position="relative">
                <Typography className={classes.textTimeLeft}>
                  01 : 30 : 36
                </Typography>
                <Typography
                  className={clsx(classes.textHeaderTime, classes.day)}
                >
                  Day
                </Typography>
                <Typography
                  className={clsx(classes.textHeaderTime, classes.hour)}
                >
                  Hour
                </Typography>
                <Typography
                  className={clsx(classes.textHeaderTime, classes.min)}
                >
                  Min
                </Typography>
              </Box>
            </Box>
            <Box className={classes.dayLeftBox}>
              <Typography className={classes.textDay}>7 OCT </Typography>
              <Typography className={classes.textYear}>2021 </Typography>
            </Box>
          </Box>
          <Box>
            <Typography className={classes.textHeader}>
              <b>30% Off</b> Selected Items
            </Typography>
            <Typography className={classes.text1}>Mom’s essentials</Typography>
            <Typography className={classes.text2}>
              Ut enim ad minim veniam, quis nostru d exercitation ullamco
              laboris nisi ut.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TimeLeftBox;
