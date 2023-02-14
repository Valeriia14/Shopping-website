import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import clsx from "clsx";
import React, { Fragment } from "react";

const TextPassword = (props) => {
  const { classes, field, showPassword, setShowPassword } = props;

  return (
    <TextField
      color="primary"
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
      disabled={field?.spec?.disabled}
      onChange={field?.onChange}
      onKeyDown={() => {
        setShowPassword((prev) => ({
          ...prev,
          [field?.key]: false
        }));
      }}
      onKeyUp={() => {
        setTimeout(() => {
          setShowPassword((prev) => ({
            ...prev,
            [field?.key]: field?.value ? true : false
          }));
        }, 1000);
      }}
      onBlur={field.onBlur}
      type={field?.spec?.inputType || "text"}
      label={field?.spec?.label}
      variant="outlined"
      format={field?.spec?.format}
      error={field.dirty && !!field?.error}
      helperText={field.dirty && field?.error}
      fullWidth
      InputProps={{
        autohighlight: "true",
        "aria-label": "search",
        autoComplete: "off",
        type: !showPassword[field?.key] ? "text" : "password",
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
                  {!showPassword[field?.key] ? (
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

export default TextPassword;
