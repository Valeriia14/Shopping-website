import { Box, Grow, makeStyles } from "@material-ui/core";
import React, { Fragment } from "react";
import CreateNewAddressForm from "../CreateNewAddressForm";
import ShippingList from "../ShippingList";
import { EditAddressChoice } from "./Components";

const ShipOutTab = (props) => {
  const {
    openCreateAddress,
    setOpenCreateAddress,
    addressList,
    setAddressList,
    editSelection,
    setEditSelection,
    setReload,
    setIsSelectAddress,
    handleCheckout
  } = props;
  return (
    <Fragment>
      {!openCreateAddress && !editSelection && (
        <Fragment>
          <ShippingList
            setOpenCreateAddress={setOpenCreateAddress}
            addressList={addressList}
            setAddressList={setAddressList}
            setEditSelection={setEditSelection}
            setIsSelectAddress={setIsSelectAddress}
            setReload={setReload}
          />
        </Fragment>
      )}
      {!openCreateAddress && editSelection && (
        <EditAddressChoice
          setOpenCreateAddress={setOpenCreateAddress}
          addressList={addressList}
          setAddressList={setAddressList}
          setEditSelection={setEditSelection}
          setIsSelectAddress={setIsSelectAddress}
        />
      )}
      {openCreateAddress && (
        <Grow in={openCreateAddress}>
          <CreateNewAddressForm
            setOpenCreateAddress={setOpenCreateAddress}
            setReload={setReload}
            handleCheckout={handleCheckout}
          />
        </Grow>
      )}
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  selectShippingMethod: {
    opacity: 0.4,
    margin: "16px 0",
  },
  textNote: {
    fontSize: 12,
    color: "grey",
    marginLeft: 32,
  },
  baseInput: {
    padding: "0",
    margin: "8px 0",
  },
  formControlLabel: {
    [theme.breakpoints.down("xs")]: {
      marginBottom: "16px",
    },
    marginTop: "8px",
    "& .MuiFormControlLabel-label": {
      fontSize: 16,
      [theme.breakpoints.down("xs")]: {
        fontSize: "16px",
        marginTop: "16px",
      },
    },
  },
  divider: {
    backgroundColor: "#979797",
    marginBottom: "8px",
    marginTop: "16px",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "12px",
    },
  },
  subTitle2: {
    fontSize: 16,
    fontWeight: "bold",
  },
}));

export default ShipOutTab;
