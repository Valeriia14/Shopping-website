import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { Fragment } from "react";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import NumberFormat from "react-number-format";
import clsx from "clsx";

const NumberPassword = (props) => {
  const { field, classes, showPassword, setShowPassword } = props;
  return (
    <NumberFormat
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
      value={field?.value}
      onValueChange={(values) => field.setValue(values.value)}
      onKeyDown={() => {
        setShowPassword((prev) => ({
          ...prev,
          [field?.key]: true
        }));
      }}
      onKeyUp={() => {
        setTimeout(() => {
          setShowPassword((prev) => ({
            ...prev,
            [field?.key]: field?.value ? false : true
          }));
        }, 500);
      }}
      error={field.dirty && !!field?.error}
      helperText={field.dirty && field?.error}
      onBlur={field.onBlur}
      onFocus={(e) => {
        e.target.removeAttribute("readonly");
      }}
      customInput={TextField}
      label={field?.spec?.label}
      variant="outlined"
      format={field?.spec?.format}
      fullWidth
      InputProps={{
        "autohighlight": "true",
        "aria-label": "search",
        "autoComplete": "new-password",
        type: showPassword[field?.key] ? "text" : "password",
        endAdornment: (
          <Fragment>
            <InputAdornment className={classes.placeholderBox} position="start">
              <Typography className={classes.placeholder}>
                {!field?.value && field?.spec?.placeholder}
              </Typography>
            </InputAdornment>
            <InputAdornment position="start">
              <Box mr={1}>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setShowPassword((prev) => ({
                      ...prev,
                      [field?.key]: !showPassword[field?.key]
                    }));
                  }}
                  onMouseDown={(event) => event.preventDefault()}
                  edge="end"
                >
                  {showPassword[field?.key] ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </Box>
            </InputAdornment>
          </Fragment>
        )
      }}
    />
  );
};

export default NumberPassword;
