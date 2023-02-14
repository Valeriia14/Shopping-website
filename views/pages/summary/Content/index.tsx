import { AccountDashboardHeader, AccountDashboardLayout } from "@ktwebsite/components";
import { Box, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import SummaryBody from "./Components/SummaryBody";


const useStyles = makeStyles((theme) => ({
  root: {
  }
}));

export default (props: any) => {
  const classes = useStyles();
  const { preloaded_data: { route_params } } = props;

  return (
    <Box className={classes.root}>
      <Container maxWidth="xl" disableGutters>
        <AccountDashboardLayout selected="dashboard">
          <AccountDashboardHeader titleText="ACCOUNT &amp; ORDER HISTORY" subTitleText="View Your Order History" />

          <SummaryBody routeParam={route_params} />

        </AccountDashboardLayout>
      </Container>
    </Box>
  );
}
