import React, { useCallback, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { Button, Grid, Hidden } from "@material-ui/core";
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
    padding: 16,
    [theme.breakpoints.down("xs")]:{
      padding: 0
    }
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
      width: "100%",
      minWidth: "auto"
    },
  },
  saveButton: {
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
      width: "100%",
      minWidth: "auto"
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
  const { setOpenCreateAddress, setReload } = props;
  const classes = useStyles();
  const { address } = JSON.parse(sessionStorage.getItem("editAddress"));
  const [createAddress, loading, error] = useAsyncTask("createAddress");
  const api = useApi();
  const self = useSelfAccount();
  const { enqueueSnackbar } = useSnackbar();

  const [typeShipping, setTypeShipping] = React.useState(
    address ? address?.type : "residential"
  );
  const [submitError, setSubmitError] = useState(false); //?
  const [formShipping, setFormShipping] = useState(
    formStructureShipping[typeShipping]
  ); //?
  const [fields, values, errors, setValues] = useFormHandler(formShipping);
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
      try {
        const body = {
          street_address: values?.address,
          firstname: values?.first_name,
          lastname: values?.last_name,
          contact_number: values?.country_code + " " + values?.phone_number,
          postal_code: values?.postal_code,
          account_id: self?.id,
          unit_no: values?.unit_no,
          country: values?.country,
          city: values?.city,
          office_department: values?.office_department,
          type: typeShipping,
          set_shipping_default: defaultShippingAddress,
        };
        if (!address) {
          await api.path("account/address/create").post({ body });
          enqueueSnackbar("Created a new shipping address successfully!", {
            variant: "success",
          });
        } else {
          await api
            .path("account/address/update", { address_id: address?.id })
            .put({ body });
          enqueueSnackbar("Shipping address has been updated successfully!", {
            variant: "success",
          });
        }
        setReload((prev) => !prev);
        sessionStorage.removeItem("editAddress");
        setOpenCreateAddress(false);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
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
          <Button
            className={classes.cancelButton}
            onClick={() => {
              sessionStorage.removeItem("editAddress");
              setOpenCreateAddress(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className={classes.saveButton}>
            SAVE ADDRESS
          </Button>
        </Box>
      </Hidden>
      <Hidden smUp={true}>
        <Box className={classes.buttonBox}>
          <StickyActionBox zIndex={5}>
            <Grid container>
              <Grid item xs={6}>
                <Box pr={1}>
                  <Button
                    className={classes.cancelButton}
                    onClick={() => {
                      sessionStorage.removeItem("editAddress");
                      setOpenCreateAddress(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box pl={1}>
                  <Button onClick={handleSubmit} className={classes.saveButton}>
                    SAVE ADDRESS
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </StickyActionBox>
        </Box>
      </Hidden>
    </Box>
  );
}
