import React, { useCallback, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { Button, Hidden } from "@material-ui/core";
import useApi from "@ktwebsite/utils/api/useApi";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import { useSnackbar } from "notistack";
import { useSelfAccount } from "@ktwebsite/hooks";
import { StickyActionBox } from "@ktwebsite/components";
import { AddNewAddress } from "./Components";
import { formStructureShipping } from "./Components/AddNewAddress/configForm";
import useFormHandler from "@ktwebsite/utils/useFormHandler";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  radioGroup: {
    flexDirection: "row",
  },
  formGroup: {
    flexDirection: "row",
    "& .Mui-checked": {
      color: "#2e2965!important",
    },
    "& .MuiCheckbox-root": {
      color: "#2e2965!important",
    },
  },
  baseInput: {
    padding: "0",
    margin: "8px 0",
  },
  baseInputLeft: {
    padding: "0 8px 0 0",
    margin: "8px 0",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
    },
  },
  baseInputRight: {
    padding: "0 0 0 8px",
    margin: "8px 0",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
    },
  },
  marginRight: {
    [theme.breakpoints.down("xs")]: {
      marginRight: 8,
    },
  },
  paddingRight: {
    paddingRight: 8,
    [theme.breakpoints.down("xs")]: {
      paddingRight: 0,
    },
  },
  address2TitleButton: {
    fontSize: "10px",
    fontWeight: 700,
    cursor: "pointer",
  },
  formControl: {
    marginTop: 12,
    "& .MuiFormControlLabel-label": {
      fontSize: "16px",
    },
  },
  buttonBox: {
    display: "flex",
    marginTop: 16,
    [theme.breakpoints.down("xs")]: {
      margin: "16px 0",
      justifyContent: "space-between",
    },
  },
  cancelButton: {
    minWidth: 150,
    height: 48,
    fontSize: "18px",
    fontFamily: "Barlow-medium",
    borderRadius: 0,
    border: "1px solid black",
    marginRight: 16,
    padding: "8px 48px",
    [theme.breakpoints.down("xs")]: {
      padding: "8px 16px",
      margin: 0,
    },
  },
  saveButton: {
    marginTop: "74px",
    minWidth: 150,
    marginRight: 16,
    height: 48,
    fontSize: "18px",
    fontFamily: "Barlow-medium",
    borderRadius: 0,
    color: "white",
    backgroundColor: "black",
    padding: "8px 48px",
    "&:hover": {
      backgroundColor: "black",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "8px 16px",
      margin: 0,
    },
  },
  subTitle2: {
    marginTop: 26,
    marginBottom: 16,
    fontSize: 16,
    fontWeight: "bold",
  },
}));

export default function CreateNewAddressForm(props) {
  const { setOpenCreateAddress, setReload, addressList, handleCheckout } = props;
  const classes = useStyles();
  const editAddress =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("editAddress")) || { address: null }
      : { address: null };
  const [createAddress, loading, error] = useAsyncTask("createAddress");
  const api = useApi();
  const self = useSelfAccount();
  const { enqueueSnackbar } = useSnackbar();
  const [address, setAddress] = useState(
    editAddress.address 
  );
  const [typeShipping, setTypeShipping] = React.useState(
    address ? address?.type : "residential"
  );
  const [submitError, setSubmitError] = useState(false);
  const [formShipping, setFormShipping] = useState(
    formStructureShipping[typeShipping]
  );
  const [fields, values, errors, setValues ] = useFormHandler(formShipping);
  const [defaultShipping, setDefaultShipping] = React.useState({
    defaultShippingAddress: address?.shipping_default ? true : false,
  });
  const { defaultShippingAddress } = defaultShipping;
  useEffect(() => {
    setFormShipping(formStructureShipping[typeShipping]);
  }, [typeShipping]);

  const handleChangeTypeAddress = useCallback((event) => {
    setTypeShipping(event.target.value);
  }, []);

  const handleChangeDefault = (event) => {
    setDefaultShipping({
      ...defaultShipping,
      [event.target.name]: event.target.checked,
    });
  };


  const handleSubmit = () => {
    createAddress(async () => {
      if(errors){
        enqueueSnackbar(Object.values(errors)[0].join(), { variant: "error" });
      }else{
        try {
          const body = {
            street_address: values?.address,
            firstname: values?.first_name,
            lastname: values?.last_name,
            ...(values?.country_code && values?.phone_number && {contact_number: values?.country_code + " " + values?.phone_number}),
            postal_code: values?.postal_code,
            account_id: self?.id,
            unit_no: values?.unit_no,
            country: values?.country,
            city: values?.city,
            office_department: values?.office_department,
            type: typeShipping,
            set_billing_default: defaultShippingAddress,
          };
          let newAddress 
          if (!address) {
            const res = await api.path("account/billing_address/create").post({ body });
            newAddress = res.data.result.model
            enqueueSnackbar("Created a new billing address successfully!", {
              variant: "success",
            });
          } else {
            newAddress = address;
            await api
              .path("account/billing_address/update", {
                billing_address_id: address?.id,
              })
              .put({ body });
            enqueueSnackbar("Billing address has been updated successfully!", {
              variant: "success",
            });
          }
          setAddress(newAddress)
          sessionStorage.setItem(
            "billingAddressSelected",
            JSON.stringify(newAddress)
          );
          handleCheckout()
        } catch (error) {
          enqueueSnackbar(error.message, { variant: "error" });
        }
    }
    });
  };
  return (
    <Box className={classes.root}>
      <AddNewAddress
        fields={fields}
        setValues={setValues}
        submitError={submitError}
        defaultShipping={defaultShipping}
        handleChangeTypeAddress={handleChangeTypeAddress}
        handleChangeDefault={handleChangeDefault}
        typeShipping={typeShipping}
        formShipping={formShipping}
      />
      <Hidden xsDown={true}>
        <Box className={classes.buttonBox}>
          {addressList && addressList.length && (
            <Button
              className={classes.cancelButton}
              onClick={() => {
                sessionStorage.removeItem("editAddress");
                setOpenCreateAddress(false);
              }}
            >
              Cancel
            </Button>
          )}
          <Button onClick={handleSubmit} className={classes.saveButton}>
            PAY NOW
          </Button>
        </Box>
      </Hidden>
      <Hidden smUp={true}>
        <Box className={classes.buttonBox}>
          <StickyActionBox zIndex={5}>
            {addressList && addressList.length && (
              <Button
                className={classes.cancelButton}
                onClick={() => {
                  sessionStorage.removeItem("editAddress");
                  setOpenCreateAddress(false);
                }}
              >
                Cancel
              </Button>
            )}
            <Button onClick={handleSubmit} className={classes.saveButton}>
              PAY NOW
            </Button>
          </StickyActionBox>
        </Box>
      </Hidden>
    </Box>
  );
}
