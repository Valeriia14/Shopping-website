import React, { Fragment, useCallback, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/styles";
import theme from "@ktwebsite/theme";
import Box from "@material-ui/core/Box";
import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import { BaseInput, CommonInput } from "@ktwebsite/components";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import { formStructure } from "../../formConfig";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0 8px",
  },
  textNote: {
    fontSize: 16,
    marginLeft: 32,
  },
  baseInput: {
    padding: "0",
    margin: "8px 0",
  },
  formControlLabel: {
    "& .MuiFormControlLabel-label": {
      fontSize: 16,
    },
  },
  subTitle2 :{
    fontSize: 16,
    fontWeight: "bold",
  }
}));

export default function PickUpTab(props) {
  const  { methodActive, setMethodActive} = props
  const [fields, values, errors, setValues] = useFormHandler(
    formStructure?.orderNotePickUp
  );
  const [submitError, setSubmitError] = useState(false); //?

  useEffect(() => {
    setMethodActive("collect_in_store")
    sessionStorage.setItem("shippingFee", "0")
    sessionStorage.removeItem("addressSelected", "0")
  }, []);

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
  const classes = useStyles();

  return (
    <Fragment>
      <Box className={classes.root}>
        <Typography className={classes.subTitle2}>SELECT SHIPPING METHOD</Typography>
        <RadioGroup
          aria-label="pickUpSelect"
          name="pickUpSelect"
          value={methodActive}
        >
          <FormControlLabel
            value="collect_in_store"
            className={classes.formControlLabel}
            control={<PrimaryRadio />}
            label="Collect In Store (3-5 bussiness days) - Free"
          />
          <Typography className={classes.textNote}>
            159 Sin Ming Rd, Singapore 575625 <br />
            #03-01
            <br />
            Opening hours : 9am - 6pm
          </Typography>
        </RadioGroup>
      </Box>
      <Box padding="24px 8px">
        <CommonInput
          fields={fields}
        />
      </Box>
    </Fragment>
  );
}
