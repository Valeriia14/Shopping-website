import { AccountDashboardHeader, AccountDashboardLayout, SignInImage } from "@ktwebsite/components";
import { useSelfAccount } from "@ktwebsite/hooks";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { Box, Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

const imageArray = ["/images/cashback-smile-point.png", "/images/icon-replacement-sport-bottle.png", "/images/property4-sipper-bottle.png", "/images/firsttimecode.png"];
const imageTextArray = ["For Every Purchase", "Accessories & Spares", "Free Straw Replacement Programme", "For Your First Purchase"];

const useStyles = makeStyles((theme) => ({
  root: {
  },
  leftContainer: {
    margin: theme.spacing(0, 3),
  },
  signInText: {
    fontSize: "18px",
    fontWeight: 600,
    color: theme.palette.primary.dark,
    marginRight: theme.spacing(2),
    paddingBottom: theme.spacing(0.5),
    borderBottom: "3px solid",
  },
  signUpText: {
    fontSize: "18px",
    fontWeight: 600,
    color: theme.palette.primary.dark
  },
  tabWrap: {
    marginBottom: theme.spacing(4)
  },
  button: {
    width: "100%",
    backgroundColor: "#067dff",
    color: "white",
    marginTop: theme.spacing(5),
    borderRadius: "6px",
    padding: theme.spacing(1),
    "&:hover": {
      backgroundColor: "#1565C0",
    },
  },
  buttonText: {
    fontSize: "14px",
    fontWeight: 700
  },
  orText: {
    textAlign: "center",
    margin: theme.spacing(3, 0),
    color: "grey"
  },
  fbButton: {
    width: "48%",
    color: "grey",
    borderRadius: "6px",
    padding: theme.spacing(1),
  },
  fbButtonText: {
    fontSize: "14px",
    textTransform: "none",
  },
  signInImg: {
    width: "100%",
    maxHeight: "180px",
    maxWidth: "180px",
    marginBottom: theme.spacing(3),
  },
  googleIcon: {
    width: "17px",
    height: "17px",
    opacity: "0.6",
    marginRight: "3px"
  }
}));

export default (props: any) => {
  const classes = useStyles();
  const self = useSelfAccount();

  useEffect(() => {
    if (self)
      doRedirect("/account/dashboard");
  }, [self])

  return (
    <Box className={classes.root}>
      <Container maxWidth="xl" disableGutters>
        <AccountDashboardLayout>
          <AccountDashboardHeader titleText="RESET YOUR PASSWORD" subTitleText="Enter the email address associated with your account, and we'll send you a link to reset your password." />
          <Grid item xs={12} md={6}>
            <ForgotPasswordForm />
          </Grid>
          <SignInImage imageArray={imageArray} imageTextArray={imageTextArray} />
        </AccountDashboardLayout>
      </Container>
    </Box>
  );
}
