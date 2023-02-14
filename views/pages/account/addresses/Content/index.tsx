import {
  AccountDashboardLayout,
  BaseButton,
  ContactBox,
} from "@ktwebsite/components";

import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { AddressesBody } from "./components";

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

  return (
    <Box className={classes.root}>
      <Container maxWidth="lg" disableGutters>
        <AccountDashboardLayout selected="addresses">
          <Box className={classes.contentBox}>
            <AddressesBody />
          </Box>
        </AccountDashboardLayout>
      </Container>
      <ContactBox />
    </Box>
  );
};
