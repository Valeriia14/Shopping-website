import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Divider,
  Hidden,
  Link,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment, useEffect, useState } from "react";
import useApi from "@ktwebsite/utils/api/useApi";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  showMoreBtn: {
    width: "auto",
    height: "25px",
    cursor: "pointer",
    minWidth: "auto",
    fontWeight: "600",
    [theme.breakpoints.up("sm")]: {
      margin: "0 auto",
    },
  },
  rightBtn: {
    margin: "0 0 0 auto !important",
  },
  showMoreText: {
    color: "black",
    fontSize: "18px",
    fontWeight: 600,
  },
  root: {
    boxSizing: "border-box",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "19px",
    padding: "0",
    marginBottom: theme.spacing(15),
    paddingBottom: theme.spacing(3),
    borderBottom: "1px solid #000",
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(7),
      borderBottom: "none",
    },
  },
  Divider: {
    margin: "24px 0px",
    backgroundColor: "black",
  },
  headerTable: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  textRow: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#000000",
  },
  textRight: {
    textAlign: "right",
    fontWeight: 600,
    fontSize: "16px",
    color: "#000000",
    justifyContent: "flex-end",
  },
  dividerRow: {
    margin: "24px 0px",
    backgroundColor: "#979797",
  },
  title: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      fontSize: "20px",
    },
  },
  topBlock: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: theme.spacing(1.5),
    borderBottom: "2px solid #000",
  },
  tableItems: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  centerText: {
    textAlign: "center",
  },
  lastRows: {
    width: "70%",
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
  },
  rowCenter: {
    display: "flex",
    alignItems: "center",
  },
  arrowRight: { marginLeft: "8px", height: "10px" },
}));

const IconAndText = ({
  text = "Order Received",
  urlImg = "/images/image-attachment.png",
}) => {
  return (
    <>
      <img
        src={urlImg}
        style={{
          width: "18px",
          maxHeight: "18px",
          objectFit: "contain",
          marginRight: "7px",
        }}
        alt={`${text}`}
      />
      {text}
    </>
  );
};

const OrderSummaryList = (props) => {
  const classes = useStyles({});

  const api = useApi();
  const [listOrder, loading, error] = useAsyncTask("listOrder");
  const [orderList, setOrderList] = useState([]);
  const [postsToShow, setPostsToShow] = useState([]);
  const postPerPage = 3;
  let arrayForHoldingPost = [];

  useEffect(() => {
    reloadOrderList();
  }, []);

  const reloadOrderList = () => {
    listOrder(async () => {
      let sessionToken = localStorage.getItem("sessionToken");

      const response = await api.path("public/order/history").get({
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      let orderRes = response.data.result ? response.data.result : [];
      if (props?.showAllList) {
        setOrderList(orderRes);
        setPostsToShow(orderRes);
      } else {
        setOrderList(orderRes);
        loopWithSlice(0, postPerPage, orderRes);
      }
    });
  };

  const loopWithSlice = (start, end, order) => {
    const slicedPosts = order.slice(start, end);
    arrayForHoldingPost = [...arrayForHoldingPost, ...slicedPosts];
    setPostsToShow(arrayForHoldingPost);
  };

  const handleShowMorePosts = () => {
    loopWithSlice(0, orderList.length, orderList);
  };

  const strFromServerToFront = (str = "unprocessed") => {
    switch (str) {
      case "processed":
        return <IconAndText text="Order Packing" />;
      case "shipped":
        return (
          <IconAndText
            text="Delivery in Progress"
            urlImg="/images/delivery_in_progress.svg"
          />
        );
      case "Conpleted":
        return <IconAndText text="Delivered" urlImg="/images/delivered.svg" />;
      case "request_partial_refund" || "request_refund":
        return <IconAndText text="Request Refund" />;
      case "partial_refund" || "refund":
        return <IconAndText text="Refunded" />;
      case "Pending Exchange":
        return <IconAndText text="Item Exchanged" />;
      default:
        return <IconAndText />;
    }
  };

  return (
    <Box className={classes.root} mt={2} width="100%">
      <Hidden smDown>
        <Box className={classes.topBlock}>
          <Typography variant="h3" className={classes.title}>
            <img
              style={{ width: "20px", marginRight: "5px" }}
              src="/images/close_box.svg"
              alt="more"
            />
            ORDER & TRACKING
          </Typography>
          {!props?.showAllList && (
            <Button
              variant="text"
              className={`${classes.showMoreBtn} ${classes.rightBtn}`}
              onClick={handleShowMorePosts}
            >
              View All
              <img
                style={{ width: "17px" }}
                src="/images/arrow_right.svg"
                alt="more"
              />
            </Button>
          )}
        </Box>
        <>
          <Grid container className={classes.tableItems} mt={2}>
            <Grid item lg={4} xs={4} md={4} sm={4}>
              <Typography className={classes.headerTable}>ORDER ID</Typography>
            </Grid>
            <Grid item lg={4} xs={4} md={4} sm={4}>
              <Typography
                className={`${classes.headerTable} ${classes.centerText}`}
              >
                ORDER DATE
              </Typography>
            </Grid>
            <Grid item lg={4} xs={4} md={4} sm={4}>
              <Typography
                className={`${classes.headerTable} ${classes.lastRows}`}
              >
                STATUS
              </Typography>
            </Grid>
          </Grid>
        </>
        <Box width="100%">
          {postsToShow.map((item, index) => (
            <Fragment key={index}>
              <Grid container>
                <Grid item lg={4} xs={4} md={4} sm={4}>
                  <Link
                    underline="none"
                    href={`/account/orders/${item.id}/summary`}
                  >
                    <Typography className={classes.textRow}>
                      ORDER #{item.reference}
                      <img
                        className={classes.arrowRight}
                        src="/images/arrow_right_mini.svg"
                      />
                    </Typography>
                  </Link>
                </Grid>
                <Grid item lg={4} xs={4} md={4} sm={4}>
                  <Typography
                    className={`${classes.textRow} ${classes.centerText}`}
                  >
                    {item.created_at
                      ? moment(item.created_at).format("DD / MM / YYYY")
                      : "-"}
                  </Typography>
                </Grid>
                <Grid item lg={4} xs={4} md={4} sm={4}>
                  <Typography
                    className={`${classes.textRow} ${classes.lastRows}`}
                  >
                    {strFromServerToFront(item.status)}
                  </Typography>
                </Grid>
              </Grid>
            </Fragment>
          ))}
          {loading && (
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
        {!props?.showAllList && (
          <Box
            mt={2}
            display="flex"
            flex="1"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="text"
              className={classes.showMoreBtn}
              onClick={handleShowMorePosts}
            >
              <img src="/images/3_dots.svg" alt="more" />
            </Button>
          </Box>
        )}
      </Hidden>
      <Hidden mdUp>
        <Typography variant="h2" className={classes.title}>
          <img
            style={{ width: "20px", marginRight: "5px" }}
            src="/images/close_box.svg"
            alt="more"
          />
          ORDER & TRACKING
        </Typography>
        <Divider className={classes.Divider} />
        <Box width="100%" display="flex" flexDirection="column">
          {postsToShow
            .slice(0, props?.showAllList ? postsToShow.length : 1)
            .map((item, index) => (
              <Fragment key={index}>
                <Grid container direction="row" justifyContent="space-between">
                  <Grid item lg={6} xs={6} md={6} sm={6}>
                    <Typography className={classes.textRow}>
                      ORDER ID
                    </Typography>
                  </Grid>
                  <Grid item lg={6} xs={6} md={6} sm={6}>
                    <Link
                      underline="none"
                      href={`/account/orders/${item.id}/summary`}
                    >
                      <Typography className={classes.textRight}>
                        ORDER #{item.reference}
                        <img
                          className={classes.arrowRight}
                          src="/images/arrow_right_mini.svg"
                        />
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
                <Grid container direction="row" justifyContent="space-between">
                  <Grid item lg={6} xs={6} md={6} sm={6}>
                    <Typography className={classes.textRow}>
                      ORDER DATE
                    </Typography>
                  </Grid>
                  <Grid item lg={6} xs={6} md={6} sm={6}>
                    <Typography className={classes.textRight}>
                      {item.created_at
                        ? moment(item.created_at).format("DD / MM / YYYY")
                        : "-"}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container direction="row" justifyContent="space-between">
                  <Grid item lg={6} xs={6} md={6} sm={6}>
                    <Typography className={classes.textRow}>STATUS</Typography>
                  </Grid>
                  <Grid item lg={6} xs={6} md={6} sm={6}>
                    <Typography
                      className={`${classes.textRight} ${classes.rowCenter}`}
                    >
                      {strFromServerToFront(item.status)}
                    </Typography>
                  </Grid>
                </Grid>
                {index != postsToShow.length - 1 ? (
                  <Divider className={classes.dividerRow} />
                ) : (
                  ""
                )}
              </Fragment>
            ))}
          {loading && (
            <Box
              width="100%"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
            >
              <CircularProgress />
            </Box>
          )}
          {!props?.showAllList && (
            <Button
              variant="text"
              className={classes.showMoreBtn}
              onClick={handleShowMorePosts}
            >
              View All
              <img
                style={{ width: "17px" }}
                src="/images/arrow_right.svg"
                alt="more"
              />
            </Button>
          )}
        </Box>
      </Hidden>
    </Box>
  );
};

export default OrderSummaryList;
