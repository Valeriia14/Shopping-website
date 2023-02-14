import React, { Fragment, useCallback, useState } from "react";
import {
  Box,
  Button,
  Grid,
  makeStyles,
  Typography,
  Divider,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { Close, ExpandLess, ExpandMore } from "@material-ui/icons";
import { PopUpDialog } from "@ktwebsite/components";
import { useSnackbar } from "notistack";
import useApi from "@ktwebsite/utils/api/useApi";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";

const useStyles = makeStyles((theme) => ({
  subTitle2:{
    fontSize:16,
    fontWeight:700,
  },
  shippingCardBox: {
    minHeight: 150,
    border: "1px solid #cdcbcb",
    margin: 8,
    borderRadius: 9,
    display: "flex",
    padding: "33px 28px",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      margin: "8px 0px",
    },
  },
  shippingCardBoxActive: {
    minHeight: 150,
    border: "1px solid #1E3A3A",
    margin: 8,
    borderRadius: 9,
    display: "flex",
    padding: "33px 28px",
    position: "relative",
   
    [theme.breakpoints.down("xs")]: {
      margin: "8px 0px",
    },
  },
  cardActive: {
    display: "flex!important",
    top: "-8px",
    right: "-8px",
    border: "1px solid #00000000",
    position: "absolute",
    borderRadius: "25px",
    backgroundColor: "#1E3A3A",
    "& svg": {
      fill: "white",
    },
  },
  ediButton: {
    position: "absolute",
    padding: 4,
    minWidth: "fit-content",
    right: "50px",
    bottom: "8px",
    borderRadius: 25,
  },
  addAddressButtonBox: {
    height: "193px",
    margin: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 30px",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
    },
  },
  addAddressButton: {
    margin: 8,
    height: "fit-content",
    borderBottom: "1px solid",
    padding: "0px",
    borderRadius: 0,
  },
  addnewbuttonBox: {
    minHeight: 150,
    margin: 8,
    backgroundColor: "#bcbcbc",
    borderRadius: 5,
    display: "flex",
    padding: 16,
    [theme.breakpoints.down("xs")]: {
      margin: "8px 0px",
    },
  },
  addButton: {
    width: "100%",
    textTransform: "none",
  },
  typeText: {
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: "19px",
    textAlign: "left",
    textTransform: "uppercase",
  },
  infoText: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "19px",
    textAlign: "left",
    paddingRight:"34px"
  },
  divider: {
    backgroundColor: "#979797",
    marginBottom: "8px",
    marginTop: "16px",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "12px",
    },
  },
  deleteButton: {
    position: "absolute",
    padding: 4,
    minWidth: "fit-content",
    right: "15px",
    bottom: "5px",
    borderRadius: 25,
  },
  popupBox: {
    "& .MuiDialogTitle-root": {
      padding: "40px 80px",
      "& h2": {
        fontSize: "24px",
        fontWeight: 700,
        lineHeight: "24px",
      },
      [theme.breakpoints.down("xs")]: {
        padding: "50px 24px 24px 24px",
        textAlign: "center",
      },
    },
    "& .MuiDialogContent-root": {
      padding: "0px 24px 40px 24px",
    },
  },
  popupCancelButton: {
    fontSize: "24px",
    fontWeight: 500,
    lineHeight: "28px",
    textAlign: "center",
    width: "200px",
    border: "1px solid",
    borderRadius: "0px",
    marginRight: 8,
  },
  popupDeleteButton: {
    fontSize: "24px",
    fontWeight: 500,
    lineHeight: "28px",
    textAlign: "center",
    width: "200px",
    borderRadius: "0px",
    marginLeft: 8,
    backgroundColor: "black",
    color: "white",
    "&:hover": {
      color: "white",
      backgroundColor: "black",
    },
  },
  addressContainer:{
    margin: "26px 0px 39px 0px"
  }
}));

const ShippingList = (props) => {
  const { setOpenCreateAddress, addressList, setIsSelectAddress ,setReload} = props;
  const classes = useStyles();
  const [isShow, setIsShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [addressIdSelect, setAddressIdSelect] = useState(null);
  const [deleteShippingAddress, loadingUpdate, errorUpdate] = useAsyncTask(
    "deleteShippingAddress"
  );
  const { enqueueSnackbar } = useSnackbar();
  const api = useApi();
  const setNameCustomer = useCallback((item) => {
    let firstName = item?.firstname ? item?.firstname : "-";
    let lastName = item?.lastname ? item?.lastname : "";
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    return firstName + " " + lastName;
  }, []); // eslint-disable-line
  const handleDelete = () => {
    sessionStorage.removeItem("editAddress");
    const addressSelected = JSON.parse(
      sessionStorage.getItem("billingAddressSelected")
    );
    if(addressSelected?.id == addressIdSelect){
      sessionStorage.setItem("billingAddressSelected", JSON.stringify({}));
    }
    deleteShippingAddress(async () => {
      try {
        await api
          .path("account/billing_address/delete", { billing_address_id: addressIdSelect })
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
      let addressSelected = JSON.parse(
        sessionStorage.getItem("billingAddressSelected")
      );
      
      return (
        <Grid key={index} item xs={12} sm={6}>
          <Box
            className={
              item?.id === addressSelected?.id
                ? classes.shippingCardBoxActive
                : classes.shippingCardBox
            }
            onClick={() => {
              sessionStorage.setItem(
                "billingAddressSelected",
                JSON.stringify(item)
              );
              addressSelected = JSON.stringify(item);
              setIsSelectAddress(true);
              setReload((prev) => !prev);
            }}
          >
            <Box display="flex" flexDirection="column" width="100%">
              <Box
                display="flex"
                margin="16px 0 0 0"
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
              <Box display="flex">
                <Typography className={classes.infoText}>
                  {item?.country || "-"} {item?.postal_code || "-"}
                </Typography>
              </Box>
            </Box>
            {item?.id === addressSelected?.id &&
            <Box className={classes.cardActive}>
              <CheckIcon />
            </Box>}
            <Button
              className={classes.ediButton}
              onClick={() => {
                sessionStorage.setItem(
                  "editAddress",
                  JSON.stringify({
                    address: item,
                    title: "EDIT ADDRESS",
                  })
                );
                setOpenCreateAddress(true);
              }}
            >
              <img src="images/Edit_icon.svg" alt="Edit" />
            </Button>
            <Button
                  className={classes.deleteButton}
                  onClick={() => {
                    setOpen(true);
                    setAddressIdSelect(item?.id);
                  }}
                >
                 <Close/>
            </Button>
          </Box>
        </Grid>
      );
    });
  };
  return (
    <Fragment>
      <Divider className={classes.divider} />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
        onClick={() => setIsShow(!isShow)}
      >
        <Box ml={1}>
          <Typography className={classes.subTitle2}>
            MY BILLING ADDRESS
          </Typography>
        </Box>
        {isShow ? <ExpandLess /> : <ExpandMore />}
      </Box>
      <Grid container className={isShow ? classes.addressContainer : ""}>{isShow && showContent()}</Grid>
      <Divider className={classes.divider} />
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
