import { Box, Typography, Dialog } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import useApi from "@ktwebsite/utils/api/useApi";
import { OrderSummary } from "@ktwebsite/components";

const useStyles = makeStyles((theme) => ({
  popupBox: {
    padding: 0,
  },
  thankYouBox: {
    width: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  smileBalloons: {
    width: "150px",
    zIndex: "100",
  },
  thankYouText: {
    color: theme.palette.primary.main,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
  },
  descriptionText: {
    fontSize: "14px",
    textAlign: "center",
  },
  referBox: {
    background: "#F1F1F1",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "10px",
    borderRadius: "20px",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  referralIcon: {
    width: "60px",
    marginTop: "-25px",
  },
  referInfo: {
    fontSize: "14px",
    fontWeight: "bold",
  },
}));

const SummaryBody = (props) => {
  const classes = useStyles();
  const api = useApi();
  const [listOrder, loading, error] = useAsyncTask("listOrder");
  const [orderDetail, setOrderDetail] = useState([]);
  const { handle } = props.routeParam;
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    reloadOrder();
  }, []);

  const reloadOrder = () => {
    listOrder(async () => {
      let reference = sessionStorage.getItem("reference") 
      const response = await api
        .path("order/detail_summary", { reference: reference })
        .get();
      let detail = response.data.result.model ? response.data.result.model : {};
      setOrderDetail(detail);
      checkLocalStorage(detail);
    });
  };

  return (
    <>
      <OrderSummary detail={orderDetail} opened />
      <Dialog open={open} onClose={handleClose} className={classes.popupBox}>
        <Box className={classes.thankYouBox}>
          <img
            src="/images/orderSummarySmiles.svg"
            className={classes.smileBalloons}
          />
          <Typography className={classes.thankYouText}>Thank You</Typography>
          <Typography className={classes.descriptionText}>
            Thank you for your purchasing
          </Typography>
          <Typography className={classes.descriptionText}>
            It will be delivered within 3-4 working days. Please contact us if
            you have any question.
          </Typography>
          <Box className={classes.referBox}>
            <img
              src="/images/referrals-welcome.png"
              className={classes.referralIcon}
            />
            <Typography className={classes.referInfo}>
              Invite friends and ear $5 per invite!
            </Typography>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default SummaryBody;
