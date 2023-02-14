import { BaseButton } from "@ktwebsite/components";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import { Box, Button, CircularProgress, Dialog, InputBase, Snackbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import clsx from "clsx";
import React, { useState } from "react";
import { VoucherTicket } from "./components";

const VoucherDialog = (props) => {
  const { children, className, onSuccess, onClose, open, ...rest } = props;
  const classes = useStyles();

  const [voucherCode, setVoucherCode] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const [runVoucherValidate, loading, error] = useAsyncTask("validateVoucher");

  const onHandleChangeVoucher = (e) => {
    setVoucherCode(e.target.value)
    setErrorMessage(null)
  }
  const onHandleApply = () => {
    if (!voucherCode || !cart)
      return
    runVoucherValidate(async () => {
      const { valid } = false
      if (!valid)
        throw new Error("Invalid voucher code");

      const order_id = cart.id;
      const body = {
        discount_code: voucherCode
      };

      await api.path("account/order/discount", { order_id }).post({ body });
      setSnackOpen(true)
      onSuccess?.()
    })
  };


  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      <Dialog
        open={open}
        onClose={onClose}
        className={classes.popupBox}
      >
        <Box className={classes.popupHeader}>
          <Typography variant="body2" className={classes.selectVoucher}>Select A voucher</Typography>
          <img src="/images/ticketCartIcon.svg" className={classes.cartVoucherIcon} />
        </Box>
        <Box className={classes.popupBody}>
          <Typography variant="h5" className={classes.cartSubTitle}>Codes available for you</Typography>
          <Box className={classes.voucherBox}>
            <VoucherTicket points="100" discount="10% OFF" description="10% discount for first timer" status="expired" valid="valid until 30 Oct 202" />
            <VoucherTicket points="100" discount="10% OFF" description="10% discount for first timer" status="available" valid="valid until 30 Oct 202" />
            <VoucherTicket points="100" discount="10% OFF" description="10% discount for first timer" status="available" valid="valid until 30 Oct 202" />
            <VoucherTicket points="100" discount="10% OFF" description="10% discount for first timer" status="available" valid="valid until 30 Oct 202" />
          </Box>
          <Typography variant="h5" className={classes.cartSubTitle}>Got another code?</Typography>
          <Box display="flex" flexDirection="row">
            <InputBase value={voucherCode} onChange={onHandleChangeVoucher} placeholder="HAPPY123" className={classes.voucherInput} />
            <BaseButton
              buttonClassName={classes.applyBtn}
              text="Apply"
              textClassName={classes.applyBtnText}
              loading={loading}
              onClick={onHandleApply}
            />
          </Box>
          {errorMessage && (
            <Typography variant="body2" color="error">{errorMessage}</Typography>
          )}
          <Box>
          </Box>
        </Box>
        <Button
          onClick={onClose}
          color="primary"
          className={classes.popupCloseBtn}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={14} />
          ) : "OK"}
        </Button>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert onClose={() => setSnackOpen(false)} severity="success">
          The voucher has been applied successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {},
  popupBox: {
    padding: 0,
    overflow: "hidden"
  },
  popupHeader: {
    borderBottom: "1px solid #ccc",
    padding: "10px",
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  popupBody: {
    padding: "10px",
    width: "500px",
    [theme.breakpoints.down("xs")]: {
      width: "300px"
    }
  },
  popupCloseBtn: {
    textAlign: "center",
    background: "#067DFF",
    color: "#fff",
    width: "100%",
    height: "36px",
    borderRadius: "0",
    marginTop: "53px",
    "&:hover": {
      background: "#067DFF",
      color: "#fff",
    }
  },
  selectVoucher: {
    fontSize: "22px",
    color: theme.palette.primary.main,
    marginRight: "10px",
    marginTop: "5px"
  },
  cartVoucherIcon: {
    width: "40px",
    height: "40px"
  },
  voucherBox: {
    height: "350px",
    overflowX: "hidden",
    overflowY: "scroll",
  },
  voucherInput: {
    background: "#EFF0F4",
    borderRadius: "50px",
    paddingLeft: "10px",
    paddingRight: "10px",
    width: "85%",
    height: "35px",
    fontSize: "14px",
    [theme.breakpoints.down("xs")]: {
      width: "200px"
    }
  },
  applyBtn: {
    border: "1px solid #2e2965",
    borderRadius: "50px",
    width: "150px",
    height: "35px",
    background: "#fff",
    marginLeft: "-50px",
    [theme.breakpoints.down("xs")]: {
      width: "100px"
    }
  },
  applyBtnText: {
    color: "#2e2965",
    fontSize: "14px"
  },
}));

export default VoucherDialog;
