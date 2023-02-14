import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import React, { Fragment, useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { Button, InputAdornment, makeStyles, TextField, Typography } from "@material-ui/core";
import clsx from "clsx";
import moment from "moment";
import { IconComponent } from "@ktwebsite/components";

const useStyles = makeStyles((theme)=>({
  datePickerButton :{
    minWidth: "fit-content",
    padding: 8,
    borderRadius: 100
  }
}))

const DatePickerField = (props) => {
  const { classes, field } = props;
  const customClasses = useStyles()
  const [open, setOpen] = useState(false);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        open={open}
        format="dd/MM/yyyy"
        label={field?.spec?.label}
        value={moment(field?.value, "DD/MM/YYYY").format()}
        onChange={(e, value) => {
          field.setValue(moment(e).format("DD/MM/YYYY"));
        }}
        onClose={() => {
          setOpen(false);
        }}
        TextFieldComponent={(props) => {
          return (
            <TextField
              {...props}
              className={
                field?.spec?.position === "left"
                  ? clsx(
                      classes.textField,
                      !field?.spec?.fullWidth && classes.inputLeft
                    )
                  : clsx(
                      classes.textField,
                      !field?.spec?.fullWidth && classes.inputRight,
                      field?.spec?.fullWidth && classes.inputFullWidth,
                      field?.spec?.inputEnd && classes.paddingInputEnd
                    )
              }
              onFocus={() => {
                setOpen(true);
              }}
              onBlur={field.onBlur}
              error={field.dirty && !!field?.error}
              helperText={field.dirty && field?.error}
              InputProps={{
                endAdornment: (
                  <Fragment>
                    <InputAdornment
                      className={classes.placeholderBox}
                      position="start"
                    >
                      <Typography className={classes.placeholder}>
                        {!field?.value && field?.spec?.placeholder}
                      </Typography>
                    </InputAdornment>
                    <InputAdornment
                      position="start"
                    >
                      <Button onClick={()=>setOpen(true)} className={customClasses.datePickerButton}>
                        <IconComponent name="celendarIcon"/>
                      </Button>
                    </InputAdornment>
                 
                  </Fragment>
                )
              }}
              variant="outlined"
            />
          );
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePickerField;
