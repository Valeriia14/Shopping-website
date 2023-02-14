import {
  Box,
  Fade,
  makeStyles,
  Slide,
  Typography
} from "@material-ui/core";
import React, {  useEffect, useState } from "react";
import { useSelfAccount } from "@ktwebsite/hooks";
import doRedirect from "@ktwebsite/utils/doRedirect";
import AddressesForm from "../AddressesForm";
import ShippingList from "../ShippingList";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
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
      marginBottom: 0
    }
  },
  textEarnPoint: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "19px",
    textAlign: "left"
  },
  textInform: {
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: "16px",
    textAlign: "left"
  },
  formControlLabel: {
    "& .MuiFormControlLabel-label": {
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: "14px",
      textAlign: "left",
      [theme.breakpoints.down("xs")]: {
        lineHeight: "20px",
        marginTop: 16
      }
    }
  },
  icon: {
    color: "#1E3A3A!important"
  },
  updateButton: {
    backgroundColor: "black",
    color: "white",
    width: "245px",
    padding: "14px",
    borderRadius: "0px",
    fontSize: "18px",
    fontWeight: 500,
    lineHeight: "21px",
    textAlign: "center",
    "&:hover": {
      backgroundColor: "black",
      color: "white"
    }
  },
  inputRoot: {
    color: "black"
  }
}));

const AddressesBody = () => {
  const classes = useStyles();
  const self = useSelfAccount();
  const [getAddresses, loading, error] = useAsyncTask("getAddresses");
  const [reload, setReload] = useState(false);
  const api = useApi();

  const [addressList, setAddressList] = useState([]);
  const [addressEdit, setAddressEdit] = useState(false);

  useEffect(() => {
    if (!self) doRedirect("/auth/signin");
    getAddresses(async () => {
      const sessionToken = localStorage.getItem("sessionToken");
      if (sessionToken) {
        const response = await api.path("account/address/list").get({
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
        const res = response.data.result ? response.data.result.model : [];
        setAddressList(res);
      }
    });
  },[reload])

  return (
    <Box className={classes.root}>
      <Box pb={3}>
        <Typography className={classes.textCapitalize}>Addresses</Typography>
      </Box>
      {!addressEdit && (
        <Fade in={!addressEdit}>
          <Box width="100%">
            <ShippingList
              addressList={addressList}
              setAddressEdit={setAddressEdit}
              setReload={setReload}
            />
          </Box>
        </Fade>
      )}
      {addressEdit && (
        <Slide direction="right" in={addressEdit}>
          <Box>
            <AddressesForm
              addressList={addressList}
              setAddressEdit={setAddressEdit}
              setReload={setReload}
            />
          </Box>
        </Slide>
      )}
    </Box>
  );
};

export default AddressesBody;
