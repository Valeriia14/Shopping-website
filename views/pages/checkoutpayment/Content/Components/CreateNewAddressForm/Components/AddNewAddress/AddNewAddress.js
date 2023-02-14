import React, { Fragment, useCallback, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";
import DoneIcon from "@material-ui/icons/Done";
import {
  Checkbox,
  FormControlLabel,
  FormControl,
  FormGroup,
} from "@material-ui/core";
import { CommonInput } from "@ktwebsite/components";

const AddNewAddress = (props) => {
  const {
    fields,
    setValues,
    defaultShipping,
    handleChangeDefault,
    formShipping,
  } = props;
  const { title, address } =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("editAddress")) || {
          title: null,
          address: null,
        }
      : { title: null, address: null };
  useEffect(() => {
    if (address) {
      let initialAddress = Object.keys(formShipping).reduce((acc, key) => {
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
            acc[key] = formShipping?.initialValue || address[key];
            return acc;
        }
      }, {});
      setValues(initialAddress);
    }
  }, [formShipping]);

  const classes = useStyles();
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

  const [isSameShippingAddress, setIsSameShippingAddress] = useState(false);
  const handleSameShippingAddress = () => {
    setIsSameShippingAddress((prev) => !prev);
    const address =
      typeof window !== "undefined"
        ? JSON.parse(sessionStorage.getItem("addressSelected"))
        : null;
    if (address) {
      let initialAddress = Object.keys(formShipping).reduce((acc, key) => {
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
            acc[key] = formShipping?.initialValue || address[key];
            return acc;
        }
      }, {});
      setValues(initialAddress);
    }
  };

  return (
    <Fragment>
      <Box>
        <Typography className={classes.subTitle2}>
          {title ? title : "ADD NEW BILLING ADDRESS"}
        </Typography>
      </Box>

      <CommonInput fields={fields} />
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup className={classes.formGroup}>
          <FormControlLabel
            control={
              <CheckboxCustom
                checked={isSameShippingAddress}
                onChange={handleSameShippingAddress}
                name="defaultShippingAddress"
              />
            }
            label="Same address from shipping address"
          />
          <FormControlLabel
            control={
              !address?.billing_default ? (
                <CheckboxCustom
                  checked={defaultShipping.defaultShippingAddress}
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
              address?.billing_default
                ? "This is your default billing address"
                : "Set as default billing address"
            }
          />
        </FormGroup>
      </FormControl>
    </Fragment>
  );
};
export default AddNewAddress;
const useStyles = makeStyles((theme) => ({
  root: {},
  formGroup: {
    flexDirection: "row",
    "& .Mui-checked": {
      color: "#2e2965!important",
    },
    "& .MuiCheckbox-root": {
      color: "#2e2965!important",
    },
  },
  formControl: {
    marginTop: 29,
    "& .MuiFormControlLabel-label": {
      fontSize: 14,
      fontWeight: 500,
    },
  },
  subTitle2: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: "17px"
  },
  icon: {
    color: "#1E3A3A!important",
  },
}));
