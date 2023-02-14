import { AccountDashboardLayout, ContactBox } from "@ktwebsite/components";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { Box, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { WishlistBody } from "./components";
import { useSelfAccount } from "@ktwebsite/hooks";

const useStyles = makeStyles((theme) => ({
  root: {},
  textCapitalize: {
    textTransform: "capitalize",
    marginBottom: theme.spacing(1),
  },
  pointText: {
    color: "black",
    fontWeight: 600,
    marginTop: theme.spacing(1),
  },
  contentBox: {
    width: "100%",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0 20px",
    },
    [theme.breakpoints.up("lg")]: {
      paddingLeft: theme.spacing(12),
    },
  },
}));

export default (props: any) => {
  const classes = useStyles();
  const self = useSelfAccount();
  useEffect(() => {
    if (!self) doRedirect("/auth/signin");
  }, [self]);
  return (
    <Box className={classes.root}>
      <Container maxWidth="lg" disableGutters>
        <AccountDashboardLayout selected="wishlist">
          <Box className={classes.contentBox}>
            <WishlistBody />
          </Box>
        </AccountDashboardLayout>
      </Container>
      <ContactBox />
    </Box>
  );
};
