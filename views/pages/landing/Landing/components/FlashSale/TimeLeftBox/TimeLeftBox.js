import { Box, Button, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    height: "369px",
    alignItems: "flex-end",
    flexDirection: "column",
    backgroundColor: "#F5F4EF",
    [theme.breakpoints.down("md")]: {
      height: "100%",
    },
  },
  flashSaleBox: {
    width: 730,
    paddingBottom: 40,
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  flashSaleHeader: {
    backgroundColor: "#3E4436",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    "& p": {
      fontFamily: "Cormorant-SemiBold",
      fontSize: "18px",
      fontWeight: 700,
      lineHeight: "22px",
      textAlign: "left",
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
    height: "100%",
    width: "100%",
    padding: "50px 30px",
    borderLeft: "1px solid",
    borderRight: "1px solid",
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
    paddingLeft: "30px",
    paddingBottom: "30px",
  },
  textDealEnding: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "30px",
    textAlign: "left",
    color: "#333333",
  },
  textTimeLeft: {
    fontSize: "24px",
    fontWeight: 700,
    lineHeight: "30px",
    textAlign: "left",
    color: "#333333,",
  },
  textHeaderTime: {
    fontFamily: "Cormorant-SemiBold",
    fontSize: "10px",
    fontWeight: 600,
    lineHeight: "30px",
    textAlign: "left",
    color: "#333333",
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
      <Box>
        <Grid container>
          <Grid item xs={6}>
            <Box className={classes.container}>
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
                <Box p="0px 30px">
                  <Typography className={classes.textHeader}>
                    <b>30% Off</b> Selected Items
                  </Typography>
                  <Typography className={classes.text1}>
                    Mom’s essentials
                  </Typography>
                  <Typography className={classes.text2}>
                    Ut enim ad minim veniam, quis nostru d exercitation ullamco
                    laboris nisi ut.
                  </Typography>
                </Box>
              </Box>
              <Button className={classes.button}>BUY NOW </Button>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" justifyContent="center">
              <img
                src="/images/suction_bowls_online_2.svg"
                alt="suction_bowls_online_2"
                className={classes.image}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TimeLeftBox;
