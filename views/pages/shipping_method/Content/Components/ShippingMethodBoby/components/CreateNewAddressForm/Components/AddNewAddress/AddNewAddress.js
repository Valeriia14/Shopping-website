import React, { Fragment, useCallback, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/styles";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";
import DoneIcon from "@material-ui/icons/Done";
import {
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormGroup,
} from "@material-ui/core";
import { CommonInput } from "@ktwebsite/components";
import clsx from "clsx";

const AddNewAddress = (props) => {
  const {
    fields,
    setValues,
    submitError,
    defaultShipping,
    handleChangeTypeAddress,
    handleChangeDefault,
    typeShipping,
    formShipping
  } = props;
  const { title, address } = JSON.parse(sessionStorage.getItem("editAddress"));
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
  const PrimaryRadio = withStyles({
    root: {
      color: "#1E3A3A!important",
      "&$checked": {
        color: "#1E3A3A!important",
      },
    },
    checked: {},
  })((props) => <Radio {...props} />);

  return (
    <Fragment>
      <Box>
        <Typography className={classes.subTitle2}>
          {title ? title : "ADD NEW ADDRESS"}
        </Typography>
      </Box>
      <Box mb={2}>
        <RadioGroup
          className={clsx(classes.radioGroup, classes.formControl)}
          aria-label="type"
          name="type"
          value={typeShipping}
          onChange={handleChangeTypeAddress}
        >
          <FormControlLabel
            className={classes.formControlLabel}
            value="residential"
            control={<PrimaryRadio />}
            label="Residential"
          />
          <FormControlLabel
            className={classes.formControlLabel}
            value="office"
            control={<PrimaryRadio />}
            label="Office"
          />
        </RadioGroup>
      </Box>
      <CommonInput fields={fields} />
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup className={classes.formGroup}>
          <FormControlLabel
            control={
              !address?.shipping_default ? (
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
              address?.shipping_default
                ? "This is your default shipping address"
                : "Set as default shipping address"
            }
          />
          {/* <FormControlLabel
            control={
              !address?.billing_default ? (
                <CheckboxCustom
                  checked={defaultShipping.defaultBillingAddress}
                  onChange={handleChangeDefault}
                  name="defaultBillingAddress"
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
          /> */}
        </FormGroup>
      </FormControl>
    </Fragment>
  );
};
export default AddNewAddress;
const useStyles = makeStyles((theme) => ({
  root: {},
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
  formControl: {
    marginTop: 12,
    "& .MuiFormControlLabel-label": {
      fontSize: "16px",
    },
  },
  divider: {
    margin: "24px 0px",
    width: "100%",
  },
  formControlLabel: {
    "& .Mui-checked": {
      color: "#2e2965!important",
    },
    "& .MuiFormControlLabel-label": {
      fontSize: 16,
    },
  },
  subTitle2: {
    fontSize: 20,
    fontWeight: "bold",
    [theme.breakpoints.down("xs")]:{
      fontSize: 16
    }
  },
  icon : {
    color : "#1E3A3A!important"
  }
}));
