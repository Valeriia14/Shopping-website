import {
  Box,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import theme from "@ktwebsite/theme";
import { ShippingList } from "..";
import { CommonInput } from "@ktwebsite/components";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import { formStructure } from "../../formConfig";

const ShipOutTab = (props) => {
  const {
    openCreateAddress,
    setOpenCreateAddress,
    methodActive,
    setMethodActive,
    isSelectAddress,
    addressList,
    setAddressList,
    editSelection,
    setEditSelection,
  } = props;
  const classes = useStyles();
  const [fields, values, errors, setValues] = useFormHandler(
    formStructure?.orderNoteShipOut
  );
  const [submitError, setSubmitError] = useState(false); //eslint-disable-line
  const isFreeShipping = typeof window === 'undefined' ? null : sessionStorage.getItem("isFreeShipping");
  useEffect(() => {
    sessionStorage.setItem("note", JSON.stringify(values?.note));
  }, [values?.note]);

  const PrimaryRadio = withStyles({
    root: {
      color: "#ccc",
      "&$checked": {
        color: theme.palette.primary.main,
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);

  const handleChangeMethod = useCallback(
    (event) => {
      setMethodActive(event.target.value);
      switch (event.target.value) {
        case "standard":
          sessionStorage.setItem("shippingFee", "0")
          break;
        default:
          sessionStorage.setItem("shippingFee", "5")
          break;
      }
    },
    [methodActive]
  );
  useEffect(() => {
    setMethodActive("standard")
  },[])
  return (
    <Fragment>
      {!openCreateAddress && !editSelection && (
        <Fragment>
          <ShippingList
            setOpenCreateAddress={setOpenCreateAddress}
            addressList={addressList}
            setAddressList={setAddressList}
            setEditSelection={setEditSelection}
          />
          <Box
            className={!isSelectAddress ? classes.selectShippingMethod : ""}
            padding="24px 8px"
          >
            <Typography className={classes.subTitle2}>
              SELECT SHIPPING METHOD
            </Typography>
            <RadioGroup
              aria-label="method"
              name="method"
              value={methodActive}
              onChange={handleChangeMethod}
            >
              <FormControlLabel
                value="standard"
                className={classes.formControlLabel}
                disabled={!isSelectAddress}
                control={<PrimaryRadio />}
                label={`Standard Courier ( 3 - 5 Business day* ) - ${ isFreeShipping == 1 ? "FREE" :"$3.00" }`}
              />
              {/* <Divider className={classes.divider} />
              <FormControlLabel
                value="express"
                disabled={!isSelectAddress}
                className={classes.formControlLabel}
                control={<PrimaryRadio />}
                label="Express Courier ( 1 - 2 Business day* ) - $5.00"
              />
              <Typography className={classes.textNote}>
                For next day delivery, please make your order before 11am. Do
                note that we are closed on weekends and public holiday.
              </Typography> */}
            </RadioGroup>
          </Box>
          {isSelectAddress && (
            <Box p={1}>
              <CommonInput fields={fields} />
            </Box>
          )}
        </Fragment>
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
