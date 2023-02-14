import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Divider,
  Hidden,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment, useEffect, useState } from "react";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import useApi from "@ktwebsite/utils/api/useApi";
import moment from "moment";
import { NotFoundPage } from "@ktwebsite/components";

const useStyles = makeStyles((theme) => ({
  root: {
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "19px",
    marginTop: theme.spacing(10),
    [theme.breakpoints.down("md")]: {
      marginTop: theme.spacing(6),
    },
  },
  Divider: {
    margin: "12px 0px",
    backgroundColor: "black",
    height: "3px",
  },
  headerTable: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  headerTableTitle: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  textRow: {
    fontWeight: 500,
    fontSize: "16px",
  },
  description: {
    textDecoration: "underline",
  },
  title: {
    fontWeight: 700,
    [theme.breakpoints.down("md")]: {
      fontSize: "24px",
      lineHeight: "24px",
    },
  },
  pointsWrapper: {
    marginTop: "22px",
  },
}));

const PointsHistory = (props) => {
  const classes = useStyles({});
  const [
    getPointHistories,
    loadinggetPointHistories,
    errorGettingPointHistories,
  ] = useAsyncTask("getPointHistories");
  const [pointHistories, setPointHistories] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const api = useApi();
  useEffect(() => {
    if (typeof getPointHistories !== "function") {
      return;
    }
    getPointHistories(async () => {
      const res = await api.path("public/reward_point/history").get();
      setPointHistories(res?.data?.result?.models || []);
      setLoadingList(false);
    });
  }, []);

  const getStatus = (status) => {
    const statuses = {
      0: "Processing",
      1: "Completed",
    };
    return statuses[status] || "";
  };
  return (
    <Box className={classes.root} width="100%">
      <Box className={classes.headerTableTitle}>
        <img src="/images/point-icon.svg" />
        <Typography variant="h3" className={classes.title}>
          POINTS HISTORY
        </Typography>
      </Box>
      <Divider className={classes.Divider} />
      <Box mt={3}>
        <Grid container>
          <Grid item lg={5} sm={5} md={4} xs={5}>
            <Typography className={classes.headerTable}>DESCRIPTION</Typography>
          </Grid>
          <Grid item lg={3} sm={3} md={3} xs={5}>
            <Typography className={classes.headerTable}>DATE</Typography>
          </Grid>
          <Grid item lg={2} sm={2} md={3} xs={2}>
            <Typography className={classes.headerTable}>POINTS</Typography>
          </Grid>
          <Hidden xsDown>
            <Grid item lg={2} sm={2} md={2}>
              <Typography className={classes.headerTable}>STATUS</Typography>
            </Grid>
          </Hidden>
        </Grid>
      </Box>
      <Box width="100%" className={classes.pointsWrapper}>
        {!pointHistories.length && <NotFoundPage title="No data" />}
        {pointHistories.map((item, index) => (
          <Fragment key={index}>
            <Grid container>
              <Grid item lg={5} sm={5} md={4} xs={5}>
                <Typography
                  className={`${classes.textRow} ${classes.description}`}
                >
                  {item.description}
                </Typography>
              </Grid>
              <Grid item lg={3} sm={3} md={3} xs={5}>
                <Typography className={classes.textRow}>
                  {item.created_at
                    ? moment(item.created_at).format("DD / MM / YYYY")
                    : "-"}
                </Typography>
              </Grid>
              <Grid item lg={2} sm={2} md={3} xs={2}>
                <Typography className={classes.textRow}>
                  {item.transaction_pts}
                </Typography>
              </Grid>
              <Hidden xsDown>
                <Grid item lg={2} sm={2} md={2}>
                  <Typography className={classes.textRow}>
                    {getStatus(item.log_status)}
                  </Typography>
                </Grid>
              </Hidden>
            </Grid>
          </Fragment>
        ))}
        {loadingList && (
          <Box
            width="100%"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PointsHistory;
