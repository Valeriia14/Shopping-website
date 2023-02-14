import { AccountDashboardLayout, ContactBox } from "@ktwebsite/components";
import { useSelfAccount } from "@ktwebsite/hooks";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import doRedirect from "@ktwebsite/utils/doRedirect";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import OrderSummaryList from "@ktwebsite/components/OrderSummaryList";
import Summary from "./components/Summary";
import useApi from "@ktwebsite/utils/api/useApi";
const useStyles = makeStyles((theme) => ({
  root: {},
  textCapitalize: {
    textTransform: "capitalize",
    fontSize: "36px",
    fontWeight: "bold",
    [theme.breakpoints.down("md")]: {
      fontSize: "24px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  mobileDivider: {
    display: "none",
    width: "100%",
    height: "1px",
    border: "none",
    backgroundColor: "#000",
    margin: "10px 0 20px 0",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  pointText: {
    color: "black",
    fontWeight: 600,
    fontSize: "36px",
    scrollMarginTop: 0,
    display: "flex",
    alignContent: "flex-end",
  },
  contentBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    [theme.breakpoints.down("sm")]: {
      padding: "0 20px",
    },
    [theme.breakpoints.up("md")]: {
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
  pigImg: { width: "64px", marginRight: "20px" },
  topBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "25px 0",
    borderTop: "2px solid #000",
    borderBottom: "1px solid #000",
    marginBottom: theme.spacing(15),
    [theme.breakpoints.down("sm")]: {
      padding: "10px 0 25px 0",
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: theme.spacing(7),
    },
  },
  points: {
    display: "flex",
    alignItems: "center",
    marginBottom: "4px",
    height: "fit-content",
    marginTop: "auto",
  },
  pointsBtn: {
    [theme.breakpoints.down("sm")]: {
      padding: "0 !important",
    },
  },
}));

export default () => {
  const classes = useStyles();
  const self = useSelfAccount();
  const [availablePoint, setAvailablePoint] = useState(0);
  const [getPoints, loadingPoints, errorGettingPoints] =
    useAsyncTask("getPoints");
  const [loadingList, setLoadingList] = useState(true);
  const api = useApi();

  useEffect(() => {
    if (!self) doRedirect("/auth/signin");
    getPoints(async () => {
      const res = await api.path("public/reward_point/available").get();
      setAvailablePoint(res?.data?.result?.models?.point_sum || 0);
      setLoadingList(false);
    });
  }, [self, availablePoint]);

  return (
    <Box className={classes.root}>
      <Container maxWidth="lg" disableGutters>
        <AccountDashboardLayout selected="dashboard">
          <Box className={classes.contentBox}>
            <Box className={classes.topBox}>
              <Typography className={classes.textCapitalize} variant="h2">
                Welcome {self?.firstname ?? ""} {self?.lastname ?? ""}
              </Typography>
              <Divider className={classes.mobileDivider} />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <img
                  className={classes.pigImg}
                  src="/images/penny-bank.svg"
                  alt="penny bank"
                />
                <Box
                  sx={{
                    flexDirection: "column",
                    display: "flex",
                  }}
                >
                  <Typography
                    variant="h4"
                    style={{ fontFamily: "Cormorant-SemiBold" }}
                  >
                    Your kidztime points :
                  </Typography>
                  {loadingList ? (
                    <CircularProgress />
                  ) : (
                    <Button
                      style={{
                        padding: "0, 2px",
                        width: "fit-content",
                      }}
                      className={classes.pointsBtn}
                      onClick={() => doRedirect("/account/points")}
                    >
                      <Typography variant="h3" className={classes.pointText}>
                        {availablePoint}
                        <Box className={classes.points}>
                          <span style={{ marginLeft: "5px", fontSize: "20px" }}>
                            POINTS
                          </span>
                          <img
                            src="/images/arrow_circle.svg"
                            style={{ marginLeft: "5px", height: "20px" }}
                            alt="arrow"
                          />
                        </Box>
                      </Typography>
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
            <OrderSummaryList />
            <Summary />
          </Box>
        </AccountDashboardLayout>
      </Container>
    </Box>
  );
};
