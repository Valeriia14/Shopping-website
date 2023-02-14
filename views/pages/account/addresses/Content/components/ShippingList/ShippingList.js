import React, { Fragment, useCallback, useState } from "react";
import { Box, Button, Grid, makeStyles, Typography } from "@material-ui/core";
import { IconComponent, PopUpDialog } from "@ktwebsite/components";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import { useSnackbar } from "notistack";
import useApi from "@ktwebsite/utils/api/useApi";
import { useStyles } from "./styles";



const ShippingList = (props) => {
  const { setAddressEdit, addressList, setReload } = props;
  const classes = useStyles();
  const api = useApi();
  const [open, setOpen] = useState(false);
  const [addressIdSelect, setAddressIdSelect] = useState(null);
  const [deleteShippingAddress, loadingUpdate, errorUpdate] = useAsyncTask(
    "deleteShippingAddress"
  );
  const { enqueueSnackbar } = useSnackbar();

  const setNameCustomer = useCallback((item) => {
    let firstName = item?.firstname || "-";
    let lastName = item?.lastname || "";
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    return firstName + " " + lastName;
  }, []); // eslint-disable-line

  const handleDelete = () => {
    deleteShippingAddress(async () => {
      try {
        const res = await api
          .path("account/address/delete", { address_id: addressIdSelect })
          .del();
        setReload((prev) => !prev);
        enqueueSnackbar("The address has been deleted successfully!", {
          variant: "success",
        });
        setOpen(false);
        setAddressIdSelect(null);
      } catch (error) {
        setOpen(false);
        setAddressIdSelect(null);
        enqueueSnackbar(error.message, { variant: "error" });
      }
    });
  };

  const showContent = () => {
    return addressList?.map((item, index) => {
      return (
        <Grid key={index} item xs={12} sm={6}>
          <Box
            className={clsx(
              item?.shipping_default || item?.billing_default
                ? classes.shippingCardBoxDefaut
                : classes.shippingCardBox,
              index % 2 === 0 ? classes.cardBoxLeft : classes.cardBoxRight
            )}
          >
            <Box className={classes.infoBox}>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
              >
                <Typography className={classes.infoText}>
                  {setNameCustomer(item)}
                </Typography>
                <Typography className={classes.infoText}>
                  {item?.contact_number || "-"}
                </Typography>
              </Box>
              <Typography className={classes.infoText}>
                {item?.street_address || "-"}
              </Typography>
              <Typography className={classes.infoText}>
                {"#" +
                  item?.unit_no.slice(0, 2) +
                  "-" +
                  item?.unit_no.slice(2, 4) || "-"}
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography className={classes.infoText}>
                  {item?.country || "-"}
                </Typography>
                <Typography className={classes.infoText}>
                  {item?.postal_code || "-"}
                </Typography>
              </Box>
            </Box>
            <Box id="cardActive" className={classes.cardActive}>
              {item?.shipping_default && (
                <Typography className={classes.typeText}>
                  DEFAULT SHIPPING
                </Typography>
              )}

              {item?.billing_default && (
                <Typography className={classes.typeText}>
                  DEFAULT BILLING
                </Typography>
              )}
            </Box>
            <Box className={classes.editButtonBox}>
              <Button
                className={classes.editButton}
                onClick={() => {
                  localStorage.setItem(
                    "editAddress",
                    JSON.stringify({
                      address: item,
                      title: "EDIT ADDRESS",
                    })
                  );
                  setAddressEdit(true);
                }}
              >
                <IconComponent name="editIcon" />
              </Button>
              {!item?.shipping_default && !item?.billing_default && (
                <Button
                  className={classes.deleteButton}
                  onClick={() => {
                    setOpen(true);
                    setAddressIdSelect(item?.id);
                  }}
                >
                  <IconComponent name="deleteIconGrey" />
                </Button>
              )}
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
              (addressList?.length + 1) % 2
                ? classes.cardBoxLeft
                : classes.cardBoxRight
            )}
          >
            <Button
              onClick={() => {
                localStorage.setItem(
                  "editAddress",
                  JSON.stringify({
                    title: undefined,
                  })
                );
                setAddressEdit(true);
              }}
              className={classes.addButton}
            >
              <AddIcon />
              &nbsp;Add new address
            </Button>
          </Box>
        </Grid>
      </Grid>
      <PopUpDialog
        open={open}
        title="Are you sure to delete this address ?"
        handleClose={() => {
          setOpen(false);
          setAddressIdSelect(null);
        }}
        className={classes.popupBox}
        content={
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              onClick={() => {
                setOpen(false);
                setAddressIdSelect(null);
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
    </Fragment>
  );
};

export default ShippingList;
