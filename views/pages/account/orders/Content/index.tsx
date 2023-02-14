import { AccountDashboardLayout, ContactBox } from "@ktwebsite/components";
import useApi from "@ktwebsite/utils/api/useApi";
import { Box, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import OrderSummaryList from "@ktwebsite/components/OrderSummaryList";
import { useSelfAccount } from "@ktwebsite/hooks";
import doRedirect from "@ktwebsite/utils/doRedirect";

const useStyles = makeStyles((theme) => ({
  accountLoginHeader: {
    fontSize: "26px",
    fontWeight: 800,
    textTransform: "uppercase",
  },
  contentBox: {
    width: "100%",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      padding: "0 20px",
    },
    [theme.breakpoints.up("lg")]: {
      paddingLeft: theme.spacing(12),
    },
  },
  title: {
    fontSize: "30px",
    marginBottom: "40px",
    [theme.breakpoints.down("md")]: {
      fontSize: "24px",
    },
  },
}));

export default () => {
  const classes = useStyles();
  const self = useSelfAccount();
  const api = useApi();
  useEffect(() => {
    if (!self) doRedirect("/auth/signin");
  }, [self]);
  return (
    <Box>
      <Container maxWidth="lg" disableGutters>
        <AccountDashboardLayout selected="orders">
          <Box className={classes.contentBox}>
            <Box display="flex" flex-direction="row" width="100%">
              <Typography variant="h2" className={classes.title}>
                ORDERS
              </Typography>
            </Box>
            <OrderSummaryList showAllList />
          </Box>
        </AccountDashboardLayout>
      </Container>
    </Box>
  );
};
