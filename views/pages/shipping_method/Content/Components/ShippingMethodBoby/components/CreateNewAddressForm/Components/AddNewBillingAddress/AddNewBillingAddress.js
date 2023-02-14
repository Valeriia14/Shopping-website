import React, { Fragment, useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import theme from "@ktwebsite/theme";
import { withStyles } from "@material-ui/styles";
import {
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormGroup,
} from "@material-ui/core";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";
import { CommonInput } from "@ktwebsite/components";
import clsx from "clsx";

const AddNewBillingAddress = (props) => {
  const {
    fields,
    submitError,
    defaultShipping,
    handleChangeDefault,
  } = props;
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
  return (
    <Fragment>
      <Box>
        <Typography className={classes.subTitle2}>
          ADD NEW BILLING ADDRESS
        </Typography>
      </Box>
      <CommonInput fields={fields} />
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup className={classes.formGroup}>
          <FormControlLabel
            control={
              <CheckboxCustom
                checked={defaultShipping.defaultBillingAddressBelow}
                onChange={handleChangeDefault}
                name="defaultBillingAddressBelow"
              />
            }
            label="Set as default billing address"
          />
        </FormGroup>
      </FormControl>
    </Fragment>
  );
};
export default AddNewBillingAddress;
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
    fontSize: 16,
    fontWeight: "bold",
  },
  icon : {
    color: "#1e3a3a!important",
  }
}));
