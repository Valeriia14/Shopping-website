import { Box, Container, makeStyles } from "@material-ui/core";
import React from "react";
import {
  AccountDashboardLayout,
  ContactBox,
} from "@ktwebsite/components";
import { PaymentMethodBody } from "./components";


const useStyles = makeStyles((theme) => ({
  root: {},
  textCapitalize: {
    textTransform: "capitalize",
    marginBottom: theme.spacing(1)
  },
  pointText: {
    color: "black",
    fontWeight: 600,
    marginTop: theme.spacing(1)
  },
  contentBox: {
    width: "100%",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0 20px"
    },
    [theme.breakpoints.up("lg")]: {
      paddingLeft: theme.spacing(12)
    }
  }
}));

const PaymentMethods = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Container maxWidth="lg" disableGutters>
        <AccountDashboardLayout selected="payment-methods">
          <Box className={classes.contentBox}>
            <PaymentMethodBody />
          </Box>
        </AccountDashboardLayout>
      </Container>
      <ContactBox />
    </Box>
  );
};

export default PaymentMethods;
