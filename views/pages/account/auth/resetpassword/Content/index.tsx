import { AccountDashboardHeader, AccountDashboardLayout } from "@ktwebsite/components";
import { Box, Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import ResetPasswordForm from "./components/ResetPasswordForm";

const useStyles = makeStyles((theme) => ({
  root: {
  },
  leftContainer: {
    margin: theme.spacing(0, 3),
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
}));

export default (props: any) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container maxWidth="xl" disableGutters>
        <AccountDashboardLayout>
          <AccountDashboardHeader titleText="RESET YOUR PASSWORD" subTitleText="" />
          <Grid item xs={12} md={6}>
            <ResetPasswordForm />
          </Grid>
        </AccountDashboardLayout>
      </Container>
    </Box>
  );
}
