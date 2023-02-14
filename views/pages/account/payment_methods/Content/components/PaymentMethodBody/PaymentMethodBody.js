import { Box, Fade, makeStyles, Slide, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { PaymentListing } from "..";
import { useSelfAccount } from "@ktwebsite/hooks";
import doRedirect from "@ktwebsite/utils/doRedirect";
import PaymentForm from "../PaymentForm/PaymentForm";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import { useSnackbar } from "notistack";
import useApi from "@ktwebsite/utils/api/useApi";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      width: "100%",
    },
  },
  textCapitalize: {
    textTransform: "capitalize",
    fontSize: "30px",
    fontWeight: 700,
    lineHeight: "35px",
    textAlign: "left",
    marginBottom: 8,
    [theme.breakpoints.down("sm")]: {
      fontSize: "24px",
      lineHeight: "28px",
      marginBottom: 0,
    },
  },
}));

const PaymentMethodBody = () => {
  const classes = useStyles();
  const self = useSelfAccount();
  const [getPaymentMethods, loading, error] = useAsyncTask("getPaymentMethods");
  const [paymentEdit, setPaymentEdit] = useState();
  const [paymentList, setPaymentList] = useState([]);
  const [reload, setReload] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const api = useApi();

  useEffect(() => {
    if (!self) doRedirect("/auth/signin");
    getPaymentMethods(async () => {
      const sessionToken = localStorage.getItem("sessionToken");
      if (sessionToken) {
        const response = await api.path("account/payment").get({
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
        const res = response.data.result ? response.data.result.model : [];
        setPaymentList(res);
      }
    });
  },[reload])
  return (
    <Box className={classes.root}>
      <Box pb={3}>
        <Typography className={classes.textCapitalize}>
          PAYMENT METHODS
        </Typography>
      </Box>
      {!paymentEdit && (
        <Fade in={!paymentEdit}>
          <PaymentListing
            paymentList={paymentList}
            setPaymentEdit={setPaymentEdit}
            setReload={setReload}
          />
        </Fade>
      )}
      {paymentEdit && (
        <Slide direction="right" in={paymentEdit}>
          <Box>
            <PaymentForm
              paymentList={paymentList}
              paymentEdit={paymentEdit}
              setPaymentEdit={setPaymentEdit}
              setReload={setReload}
            />
          </Box>
        </Slide>
      )}
    </Box>
  );
};

export default PaymentMethodBody;
