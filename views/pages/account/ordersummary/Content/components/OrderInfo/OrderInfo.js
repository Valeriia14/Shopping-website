import { Box, Typography, Grid, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useSelfAccount } from "@ktwebsite/hooks";
const useStyles = makeStyles((theme) => ({
  root: {
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "19px",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      marginBottom: "0",
    },
  },
  pointText: {
    color: "black",
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    fontSize: "16px",
    fontFamily: "Barlow-Bold",
  },
  title: {
    color: "black",
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
    fontSize: "16px",
    fontFamily: "Barlow-Bold",
  },
  icon: {
    margin: "5px",
  },
  Divider: {
    margin: "12px 0px",
    backgroundColor: "black",
  },
  infoBlock: {
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(2),
    },
  },
}));

const EarnPoints = (props) => {
  const classes = useStyles({});
  const self = useSelfAccount();
  const { order } = props;
  return (
    <Box className={classes.root} width="100%">
      <Grid container spacing={2}>
        <Grid item lg={4} md={4} sm={8} xs={8} className={classes.infoBlock}>
          <Box>
            <Typography className={classes.title}>SHIPPING ADDRESS</Typography>
            <Divider className={classes.Divider} />
            <Typography className={classes.pointText}>
              {order?.shipping_address} - {order?.shipping_postal}
            </Typography>
            <Typography style={{ fontSize: "16px" }}>
              Ship by Standard Courier
            </Typography>
          </Box>
        </Grid>
        <Grid item lg={4} md={4} sm={8} xs={8} className={classes.infoBlock}>
          <Box>
            <Typography className={classes.title}>BILLING ADDRESS</Typography>
            <Divider className={classes.Divider} />
            <Typography className={classes.pointText}>
              {order?.billing_address} - {order?.billing_postal}
            </Typography>
          </Box>
        </Grid>
        <Grid item lg={4} md={4} sm={8} xs={8} className={classes.infoBlock}>
          <Box>
            <Typography className={classes.title}>PAYMENT METHOD</Typography>
            <Divider className={classes.Divider} />
            <Typography className={classes.pointText}>Credit Card</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EarnPoints;
