import { Box, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "19px",
    marginTop: theme.spacing(6),
  },
  pointText: {
    color: "#1E3A3A",
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
    fontSize: "16px",
  },
  pointLabel: {
    color: "black",
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "16px",
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  box: {
    marginTop: "42px",
    [theme.breakpoints.down("md")]: {
      marginTop: "20px",
    },
  },
}));

const EarnPoints = (props) => {
  const classes = useStyles({});
  return (
    <Box className={classes.root} mt={2} width="100%">
      <Typography variant="h3">EARN POINTS</Typography>
      <Typography className={classes.pointText}>
        Earn 1 point for every $1 spent! More ways to earn points:
      </Typography>
      <Grid container>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Box display="flex" className={classes.box}>
            <Grid item lg={1} xs={1} sm={1} md={1} className={classes.icon}>
              <img src="/images/check-filled.svg" />
            </Grid>
            <Grid item lg={11} xs={7} sm={9} md={11}>
              <Typography className={classes.pointLabel}>
                Create an account
              </Typography>
              <Typography className={classes.pointText}>+50 points</Typography>
            </Grid>
          </Box>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Box display="flex" className={classes.box}>
            <Grid item lg={1} xs={1} sm={1} md={1} className={classes.icon}>
              <img src="/images/check-outlined.svg" />
            </Grid>
            <Grid item lg={11} xs={7} sm={9} md={11}>
              <Typography className={classes.pointLabel}>
                Complete your profile
              </Typography>
              <Typography className={classes.pointText}>+30 points</Typography>
            </Grid>
          </Box>
        </Grid>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <Box display="flex" className={classes.box}>
            <Grid item lg={1} xs={1} sm={1} md={1} className={classes.icon}>
              <img src="/images/check-outlined.svg" />
            </Grid>
            <Grid item lg={11} xs={7} sm={9} md={11}>
              <Typography className={classes.pointLabel}>
                Write a review
              </Typography>
              <Typography className={classes.pointText}>+5 points</Typography>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EarnPoints;
