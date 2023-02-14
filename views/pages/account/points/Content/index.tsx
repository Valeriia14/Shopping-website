import {
  AccountDashboardLayout,
  BaseButton,
  ContactBox,
} from "@ktwebsite/components";
import { useSelfAccount } from "@ktwebsite/hooks";
import doRedirect from "@ktwebsite/utils/doRedirect";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import PointsHistory from "./components/PointsHistory";
import EarnPoints from "./components/EarnPoints";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import useApi from "@ktwebsite/utils/api/useApi";
const useStyles = makeStyles((theme) => ({
  root: {},
  Divider: {
    marginTop: "10px",
    backgroundColor: "black",
    width: "110%",
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
    fontSize: "36px",
    [theme.breakpoints.down("md")]: {
      fontSize: "24px",
    },
  },
  titleWrapper: {
    display: "flex",
    gap: "29px",
    alignItems: "center",
  },
}));

export default (props: any) => {
  const classes = useStyles();
  const self = useSelfAccount();
  const [getPoints, loadingPoints, errorGettingPoints] =
    useAsyncTask("getPoints");
  const [availablePoint, setAvailablePoint] = useState(0);
  const [loadingList, setLoadingList] = useState(true);
  const api = useApi();

  useEffect(() => {
    if (!self) doRedirect("/auth/signin");

    if (typeof getPoints !== "function") {
      return;
    }
    getPoints(async () => {
      const res = await api.path("public/reward_point/available").get();
      setAvailablePoint(res?.data?.result?.models?.point_sum || 0);
      setLoadingList(false);
    });
  }, [self]);
  return (
    <Box className={classes.root}>
      <Container maxWidth="lg" disableGutters>
        <AccountDashboardLayout selected="points">
          <Box className={classes.contentBox}>
            <Box display="flex" flex-direction="row" width="100%">
              <Box>
                <Box className={classes.titleWrapper}>
                  <img src="/images/penny-bank.svg" alt="Alt prop" />
                  <Box>
                    <Typography variant="h2" className={classes.title}>
                      My kidztime points:
                    </Typography>
                    {loadingList ? (
                      <CircularProgress />
                    ) : (
                      <Typography variant="h2" className={classes.title}>
                        {availablePoint}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Divider className={classes.Divider} />
              </Box>
            </Box>
            <EarnPoints />
            <PointsHistory />
          </Box>
        </AccountDashboardLayout>
      </Container>
    </Box>
  );
};
