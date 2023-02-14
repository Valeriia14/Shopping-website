import { AccountDashboardLayout, NotFoundPage } from "@ktwebsite/components";
import useApi from "@ktwebsite/utils/api/useApi";
import { Box, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment, useEffect, useState } from "react";
import OrderItemList from "./components/OrderItemList";
import OrderInfo from "./components/OrderInfo";
import { useSelfAccount } from "@ktwebsite/hooks";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { usePageData } from "@ktwebsite/hooks";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  subTitle: {
    fontSize: "14px",
    fontWeight: 400,
  },
  title: {
    fontSize: "30px",
    fontWeight: "bold",
    [theme.breakpoints.down("md")]: {
      fontSize: "24px",
    },
  },
  topText: {
    marginBottom: theme.spacing(7),
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(5),
    },
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
}));

export default () => {
  const classes = useStyles();
  const self = useSelfAccount();
  const api = useApi();

  const order = usePageData((data) => data.order);

  useEffect(() => {
    if (!self) doRedirect("/auth/signin");
  }, [self]);
  return (
    <Box>
      <Container maxWidth="lg" disableGutters>
        <AccountDashboardLayout selected="orders">
          <Box className={classes.contentBox}>
            {order ? (
              <Fragment>
                <Box display="flex" className={classes.topText} width="100%">
                  <Box>
                    <Typography variant="h2" className={classes.title}>
                      ORDER ID #{order.reference}
                    </Typography>
                    <Typography className={classes.subTitle}>
                      Order placed on
                      {order.created_at
                        ? moment(order.created_at).format(
                            " DD / MM / YYYY | HH:mm"
                          )
                        : "-"}
                    </Typography>
                  </Box>
                </Box>
                <OrderInfo order={order} />
                <OrderItemList order={order} />
              </Fragment>
            ) : (
              <NotFoundPage title="Oops! We cannot find this order." />
            )}
          </Box>
        </AccountDashboardLayout>
      </Container>
    </Box>
  );
};
