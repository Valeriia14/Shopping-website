import { Box, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(1, 2),
    },
  },
  accountTextWrap: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  accountIcon: {
    marginRight: theme.spacing(3),
    width: "28px",
    height: "28px",
    [theme.breakpoints.down("xs")]: {
      width: "20px",
      height: "20px",
    },
  },
  listingRightIcon: {
    fontSize: "24px",
  },
  listingText: {
    fontSize: "18px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
    },
    fontWeight: 600
  },
  signoutText: {
    fontSize: "14px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
    },
    fontWeight: 600,
    textTransform: "none",
  },

}));

const AccountListItem = props => {
  const { onClick } = props;
  const classes = useStyles();

  return (
    <Box className={classes.root} onClick={onClick}>
      <Box className={classes.accountTextWrap}>
        <PersonIcon className={classes.accountIcon} />
        <Typography className={classes.listingText}>Seed</Typography>
      </Box>
      <Button variant="outlined" color="primary">
        <Typography className={classes.signoutText}>Sign Out</Typography>
      </Button>
    </Box>
  )
};

export default AccountListItem;