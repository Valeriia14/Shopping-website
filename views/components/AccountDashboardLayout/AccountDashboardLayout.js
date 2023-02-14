import { Box, Grid, Hidden } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import AccountSideBar from "../AccountSideBar/AccountSideBar";
import AccountTopBar from "../AccountTopBar/AccountTopBar";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(10),
    [theme.breakpoints.down("md")]: {
      marginBottom: theme.spacing(0),
    },
  },
  accountBox: {
    paddingTop: theme.spacing(14),
    paddingBottom: theme.spacing(6),
    [theme.breakpoints.down("sm")]: {
      paddingTop: theme.spacing(7),
    },
  },
  formGrid: {
    [theme.breakpoints.up("lg")]: {
      paddingLeft: "0px",
    },
  },
}));

const AccountLoginHeader = (props) => {
  const classes = useStyles();
  const { selected } = props;
  return (
    <Box className={classes.root}>
      <AccountTopBar selected={selected} />
      <Box className={classes.accountBox}>
        <Grid container>
          <Hidden mdDown>
            <Grid item md={3}>
              <AccountSideBar selected={selected} />
            </Grid>
          </Hidden>
          <Grid container item xs={12} lg={9} className={classes.formGrid}>
            {props.children}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AccountLoginHeader;
