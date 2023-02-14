import {
  AccountDashboardLayout,
  BaseButton,
  ContactBox,
} from "@ktwebsite/components";
// import { useSelfAccount } from "@ktwebsite/hooks";
// import doRedirect from "@ktwebsite/utils/doRedirect";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { ProfileBody } from "./components";
// import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
// import useApi from "@ktwebsite/utils/api/useApi";
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
  contentBox : {
    [theme.breakpoints.down("md")]:{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      padding: "0 20px"
    },
    [theme.breakpoints.up("lg")]:{
      paddingLeft: theme.spacing(12)
    }
  }
}));

export default (props: any) => {
  const classes = useStyles();
  // const self = useSelfAccount();
  // const [getPoints, loadingPoints, errorGettingPoints] =
  //   useAsyncTask("getPoints");
  // const [points, setPoints] = useState(0);
  // const [loadingList, setLoadingList] = useState(true);
  // const api = useApi();

  // useEffect(() => {
  //   if (!self) doRedirect("/auth/signin");

  //   if (typeof getPoints !== "function") {
  //     return;
  //   }
  //   getPoints(async () => {
  //     let sessionToken = localStorage.getItem("sessionToken");
  //     const response = await api.path("account/voucherify/profile").post({
  //       headers: {
  //         Authorization: `Bearer ${sessionToken}`,
  //       },
  //     });
  //     const resPoints = response.data.result.customer_account
  //       ? response.data.result.customer_account.loyalty.points
  //       : 0;
  //     setPoints(resPoints);
  //     setLoadingList(false);
  //   });
  // }, [self, points]);

  return (
    <Box className={classes.root}>
      <Container maxWidth="lg" disableGutters>
        <AccountDashboardLayout selected="profile">
          <Box className={classes.contentBox}>
            <Box display="flex" flex-direction="row" width="100%">
              <ProfileBody/>
            </Box>
          </Box>
        </AccountDashboardLayout>
      </Container>
      <ContactBox />
    </Box>
  );
};
