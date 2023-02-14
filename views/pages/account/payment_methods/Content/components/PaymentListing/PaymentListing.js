import { Box, Button, Grid, makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import AddIcon from "@material-ui/icons/Add";
import React, { Fragment, useState } from "react";
import {
  ValidateCardCredit,
  IconComponent,
  PopUpDialog,
} from "@ktwebsite/components";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import { useSnackbar } from "notistack";
import useApi from "@ktwebsite/utils/api/useApi";
import { useStyles } from "./styles";

const PaymentListing = (props) => {
  const { paymentList, setPaymentEdit, setReload } = props;
  const api = useApi();
  const [deletePaymentMethods, loading, error] = useAsyncTask(
    "deletePaymentMethods"
  );
  const [updatePaymentMethods, loadingUpdate, errorUpdate] = useAsyncTask(
    "updatePaymentMethods"
  );
  const [open, setOpen] = useState(false);
  const [openSetDefault, setOpenSetDefault] = useState(false);
  const [objectMetaIdSelect, setObjectMetaIdSelect] = useState(null);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = () => {
    deletePaymentMethods(async () => {
      try {
        const res = await api
          .path("account/payment/delete", { objectmeta_id: objectMetaIdSelect })
          .del();
        setReload((prev) => !prev);
        enqueueSnackbar("The payment method has been deleted successfully!", {
          variant: "success",
        });
        setOpen(false);
        setObjectMetaIdSelect(null);
      } catch (error) {
        setOpen(false);
        setObjectMetaIdSelect(null);
        enqueueSnackbar(error.message, { variant: "error" });
      }
    });
  };

  const handleSetDefault = () => {
    updatePaymentMethods(async () => {
      try {
        const res = await api
          .path("account/payment/update", { objectmeta_id: objectMetaIdSelect })
          .put();
        setReload((prev) => !prev);
        enqueueSnackbar("The payment method has been updated successfully!", {
          variant: "success",
        });
        setOpenSetDefault(false);
        setObjectMetaIdSelect(null);
      } catch (error) {
        setOpenSetDefault(false);
        setObjectMetaIdSelect(null);
        enqueueSnackbar(error.message, { variant: "error" });
      }
    });
  };

  const showContent = () => {
    return paymentList?.map((item, index) => {
      return (
        <Grid key={index} item xs={12} sm={6}>
          <Box
            className={clsx(
              item?.account?.payment_method_default_id
                ? classes.paymentCardBoxDefaut
                : classes.paymentCardBox,
              index % 2 === 0 ? classes.cardBoxLeft : classes.cardBoxRight
            )}
          >
            <Box
              onClick={() => {
                setOpenSetDefault(true);
                setObjectMetaIdSelect(item?.id);
              }}
              display="flex"
              style={{ cursor: "pointer" }}
            >
              <Box width="100px" display="flex" alignItems="center" mr={2}>
                <ValidateCardCredit brand={item?.extra0 || "invalid_card"} />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
              >
                <Typography className={classes.cardNumber}>
                  {item?.extra1 || "-"}
                </Typography>
                <Typography className={classes.expiryDate}>
                  Expires on {item?.extra2 + "/" + item?.extra3?.slice(2)}
                </Typography>
              </Box>
            </Box>
            <Box id="cardActive" className={classes.cardActive}>
              <Typography className={classes.typeText}>DEFAULT card</Typography>
            </Box>

            <Box className={classes.editButtonBox}>
              <Button
                className={classes.deleteButton}
                onClick={() => {
                  setOpen(true);
                  setObjectMetaIdSelect(item?.id);
                }}
              >
                <IconComponent name="deleteIconGrey" />
              </Button>
            </Box>
          </Box>
        </Grid>
      );
    });
  };
  return (
    <Fragment>
      <Grid container>
        {showContent()}

        <Grid item xs={12} sm={6}>
          <Box
            className={clsx(
              classes.addnewbuttonBox,
              (paymentList?.length + 1) % 2
                ? classes.cardBoxLeft
                : classes.cardBoxRight
            )}
          >
            <Button
              onClick={() => {
                localStorage.setItem("editPayment", JSON.stringify({}));
                setPaymentEdit(true);
              }}
              className={classes.addButton}
            >
              <AddIcon />
              &nbsp;Add payment method
            </Button>
          </Box>
        </Grid>
      </Grid>
      <PopUpDialog
        open={open}
        title="Are you sure to delete this payment method ?"
        handleClose={() => {
          setOpen(false);
          setObjectMetaIdSelect(null);
        }}
        className={classes.popupBox}
        content={
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              onClick={() => {
                setOpen(false);
                setObjectMetaIdSelect(null);
              }}
              className={classes.popupCancelButton}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className={classes.popupDeleteButton}
            >
              Delete
            </Button>
          </Box>
        }
      />
      <PopUpDialog
        open={openSetDefault}
        title="Do you want to set default this payment method ?"
        handleClose={() => {
          setOpenSetDefault(false);
          setObjectMetaIdSelect(null);
        }}
        className={classes.popupBox}
        content={
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              onClick={() => {
                setOpenSetDefault(false);
                setObjectMetaIdSelect(null);
              }}
              className={classes.popupCancelButton}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSetDefault}
              className={classes.popupDeleteButton}
            >
              Update
            </Button>
          </Box>
        }
      />
    </Fragment>
  );
};

export default PaymentListing;
