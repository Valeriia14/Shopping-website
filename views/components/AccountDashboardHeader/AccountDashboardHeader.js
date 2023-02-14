import doRedirect from "@ktwebsite/utils/doRedirect";
import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import React from "react";
import BaseButton from "../BaseButton";

const useStyles = makeStyles((theme) => ({
  root: {
    borderBottom: "1px solid #252525",
    margin: theme.spacing(3),
    paddingBottom: theme.spacing(2)
  },
  accountLoginHeader: {
    fontSize: "26px",
    fontWeight: 800,
    textTransform: "uppercase",
  },
  accountLoginText: {
    fontSize: "20px",
    fontWeight: 800,
    marginTop: theme.spacing(2)
  },
  signoutButton: {
    background: "#e0e1e2",
    [theme.breakpoints.down("xs")]: {
      textAlign: "center"
    }
  },
  signoutText: {
    color: "rgba(0,0,0,.6)",
    fontSize: "14px",
    fontWeight: "600"
  }
}));

const AccountDashboardHeader = props => {
  const classes = useStyles();
  const { titleText, subTitleText, signOutBtn } = props;
  const onSignOut = () => {
    document.cookie = `authorization=; expires=${moment().format()}; path=/;`;
    sessionStorage.removeItem('sessionToken');
    doRedirect("/auth/signin");
  }
  return (
    <Grid item xs={12} className={classes.root}>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        {titleText && <Box>
          <Typography variant="h3" className={classes.accountLoginHeader}>{titleText}</Typography>
        </Box>}
        {signOutBtn && <Box>
          <BaseButton buttonClassName={classes.signoutButton} onClick={onSignOut}
            text="Sign Out" textClassName={classes.signoutText} />
        </Box>}
      </Box>
      <Box>
        <Typography variant="body2" className={classes.accountLoginText}>{subTitleText}</Typography>
      </Box>
    </Grid>
  );
};

export default AccountDashboardHeader;
