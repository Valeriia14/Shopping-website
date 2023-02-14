import {
  Box,
  Typography,
  Grid,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";


const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    fontWeight: "bold",
    fontSize: "30px",
    lineHeight: "24px",
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    [theme.breakpoints.down("md")]: {
      fontSize: "24px",
    },
  },
  subTitle: {
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: "19px",
  },
  dividerRow: {
    margin: "24px 0px",
    backgroundImage: "linear-gradient(to right, #979797 50%, white 50%)",
    backgroundPosition: "top",
    backgroundSize: "20px 2px",
    backgroundRepeat: "repeat-x",
  },
  iconText: {
    fontWeight: "bold",
    fontSize: "14px",
    lineHeight: "16px",
    [theme.breakpoints.down("md")]: {
      fontSize: "12px",
    },
  },
}));

const WantReturnItem = (props) => {
  const classes = useStyles({});

  return (
    <Box mt={2}>
      <Typography className={classes.title}>WANT TO REFUND AN ITEM?</Typography>
      <Grid container spacing={2}>
        <Grid item lg={6} xs={12} md={6} sm={12}>
          <Typography className={classes.subTitle}>
            Please kindly ensure that your item is refurnable with the following
            checklist
          </Typography>
        </Grid>
        <Grid item lg={2} xs={4} md={2} sm={4}>
          <img src="/images/Calendar_icon.png" className={classes.icon} />
          <Typography className={classes.iconText}>
            Within 14 days of receiving items
          </Typography>
        </Grid>
        <Grid item lg={2} xs={4} md={2} sm={4}>
          <img src="/images/Tag_icon.png" className={classes.icon} />
          <Typography className={classes.iconText}>
            Original condition & tags intact
          </Typography>
        </Grid>
        <Grid item lg={2} xs={4} md={2} sm={4}>
          <img src="/images/Bag_icon.png" className={classes.icon} />
          <Typography className={classes.iconText}>
            Original packaging
          </Typography>
        </Grid>
      </Grid>
      <Divider className={classes.dividerRow} />
    </Box>
  );
};

export default WantReturnItem;
