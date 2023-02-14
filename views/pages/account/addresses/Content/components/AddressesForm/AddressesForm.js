import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Hidden,
  makeStyles,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import { StickyActionBox, CommonInput } from "@ktwebsite/components";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";
import { formStructures } from "./configForm";
import DoneIcon from "@material-ui/icons/Done";
import useApi from "@ktwebsite/utils/api/useApi";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import { useSnackbar } from "notistack";
import { useSelfAccount } from "@ktwebsite/hooks";

const useStyles = makeStyles((theme) => ({
  root: {},
  radioGroup: {
    flexDirection: "row",
  },
  formControl: {},
  formGroup: {
    flexDirection: "row",
    // [theme.breakpoints.down("xs")]: {
    //   width: "100%",
    // },
    "& .Mui-checked": {
      color: "#2e2965!important",
    },
  },
  buttonBox: {
    display: "flex",
    marginTop: 16,
    [theme.breakpoints.down("sm")]: {
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
  icon: {
    color: "#1E3A3A!important",
  },
}));

const AddressesForm = (props) => {
  const classes = useStyles();
  const { setAddressEdit, addressList, setReload } = props;
  const address = JSON.parse(localStorage.getItem("editAddress")).address;
  const self = useSelfAccount();
  const [addressTypeActive, SetAddressTypeActive] = React.useState(
    address ? address?.type : "residential"
  );
  const [formStructure, SetFormStructure] = React.useState(
    formStructures[addressTypeActive]
  );
  const [fields, values, errors, setValues] = useFormHandler(formStructure);
  const [OpenAddressline2, setOpenAddressline2] = useState(false);
  const [createAddress, loading, error] = useAsyncTask("createAddress");
  const api = useApi();
  const { enqueueSnackbar } = useSnackbar();
  const [defaultShipping, setDefaultShipping] = React.useState({
    defaultShippingAddress:
      addressList?.lenght === 0 || address?.shipping_default ? true : false,
  });
  const { defaultShippingAddress } = defaultShipping;

  const handleChangeDefault = (event) => {
    setDefaultShipping({
      ...defaultShipping,
      [event.target.name]: event.target.checked,
    });
  };

  const handleChangeMethod = useCallback((event) => {
    SetAddressTypeActive(event.target.value);
  }, []);

  const CheckboxCustom = (props) => {
    return (
      <Checkbox
        {...props}
        color="default"
        classes={{
          root: classes.inputRoot,
          checked: classes.checked,
        }}
        className={classes.checkBox}
        icon={<CheckBoxOutlineBlankOutlinedIcon className={classes.icon} />}
        checkedIcon={<CheckBoxOutlinedIcon className={classes.icon} />}
      />
    );
  };

  useEffect(() => {
    SetFormStructure(formStructures[addressTypeActive]);
  }, [addressTypeActive]);

  useEffect(() => {
    if (address) {
      let initialAddress = Object.keys(formStructure).reduce((acc, key) => {
        switch (key) {
          case "address":
            acc["address"] = address["street_address"];
            return acc;
          case "first_name":
            acc["first_name"] = address["firstname"];
            return acc;
          case "last_name":
            acc["last_name"] = address["lastname"];
            return acc;
          case "country_code":
            acc["country_code"] = address["contact_number"].split(" ")[0];
            return acc;
          case "phone_number":
            acc["phone_number"] = address["contact_number"].split(" ")[1];
            return acc;
          case "office_department":
            acc["office_department"] = address["office_department"] || "";
            return acc;
          default:
            acc[key] = formStructure?.initialValue || address[key];
            return acc;
        }
      }, {});
      setValues(initialAddress);
    }
  }, [formStructure]);

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
          type: addressTypeActive,
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
        localStorage.removeItem("editAddress");
        setAddressEdit(false);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    });
  };

  return (
    <Fragment>
      <Box>
        <RadioGroup
          className={classes.radioGroup}
          value={addressTypeActive}
          onChange={handleChangeMethod}
        >
          <FormControlLabel
            value="residential"
            control={<Radio color="primary" />}
            label="Residential"
          />
          <FormControlLabel
            value="office"
            control={<Radio color="primary" />}
            label="Office"
          />
        </RadioGroup>
      </Box>
      <CommonInput
        setOpenAddressline2={setOpenAddressline2}
        OpenAddressline2={OpenAddressline2}
        fields={fields}
      />
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup className={classes.formGroup}>
          <FormControlLabel
            control={
              !address?.shipping_default ? (
                <CheckboxCustom
                  checked={defaultShippingAddress}
                  onChange={handleChangeDefault}
                  name="defaultShippingAddress"
                />
              ) : (
                <Box m="10px">
                  <DoneIcon className={classes.icon} />
                </Box>
              )
            }
            label={
              address?.shipping_default
                ? "This is your default shipping address"
                : "Set as default shipping address"
            }
          />
        </FormGroup>
      </FormControl>
      <Hidden xsDown={true}>
        <Box className={classes.buttonBox}>
          <Button
            className={classes.cancelButton}
            onClick={() => {
              localStorage.removeItem("editAddress");
              setAddressEdit(false);
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
            <Button
              className={classes.cancelButton}
              onClick={() => {
                localStorage.removeItem("editAddress");
                setAddressEdit(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} className={classes.saveButton}>
              SAVE ADDRESS
            </Button>
          </StickyActionBox>
        </Box>
      </Hidden>
    </Fragment>
  );
};
export default AddressesForm;
