import {
  Box,
  Collapse,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { Fragment, useCallback, useState } from "react";
import clsx from "clsx";
import { Autocomplete } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import NumberFormat from "react-number-format";
import { useStyles } from "./styles";
import { ValidateCardCredit } from "..";
import {
  ChangePasswordComponent,
  DatePickerField,
  NumberPassword,
  TextPassword,
} from "./components";

const CommonInput = (props) => {
  const classes = useStyles();
  const { fields } = props;
  const [openAddressline2, setOpenAddressline2] = useState(false);
  const [search, setSearch] = useState({});
  const [showPassword, setShowPassword] = useState({});

  const showContent = useCallback(
    (field) => {
      switch (field?.spec?.type) {
        case "changePasswordComponent":
          return <ChangePasswordComponent fields={fields} />;
        case "datePicker":
          return <DatePickerField classes={classes} field={field} />;
        case "numberPassword":
          return (
            <NumberPassword
              classes={classes}
              field={field}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          );
        case "area":
          return (
            <TextField
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
                      field?.spec?.inputEnd && classes.paddingInputEnd,
                      field?.spec?.inputEndRight && classes.paddingInputEndRight
                    )
              }
              value={field?.value}
              onChange={field?.onChange}
              error={field.dirty && !!field?.error}
              helperText={field.dirty && field?.error}
              onBlur={field.onBlur}
              label={field?.spec?.label}
              type={field?.spec?.inputType || "text"}
              fullWidth
              multiline
              minRows={field?.spec?.minRows || 3}
              variant="outlined"
              inputProps={{
                maxLength: field?.spec?.maxLength || undefined,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    className={classes.placeholderBox}
                    position="start"
                  >
                    <Typography className={classes.placeholder}>
                      {!field?.value && field?.spec?.placeholder}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          );
        case "number":
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
                      field?.spec?.inputEnd && classes.paddingInputEnd,
                      field?.spec?.inputEndRight && classes.paddingInputEndRight
                    )
              }
              value={field?.value}
              onValueChange={(values) => field.setValue(values.value)}
              error={field.dirty && !!field?.error}
              helperText={field.dirty && field?.error}
              onBlur={field.onBlur}
              customInput={TextField}
              label={field?.spec?.label}
              variant="outlined"
              fullWidth
              format={field?.spec?.format}
              InputProps={{
                "aria-label": "search",
                autoComplete: "off",
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
                    {field?.spec?.validateCard && (
                      <InputAdornment position="start">
                        <Box width="50px">
                          <ValidateCardCredit value={field?.value} />
                        </Box>
                      </InputAdornment>
                    )}
                  </Fragment>
                ),
              }}
            />
          );
        case "select":
          return (
            <Autocomplete
              autoHighlight
              className={classes.autoComplete}
              options={field?.spec?.options}
              getOptionLabel={field?.spec?.getOptionLabel}
              getOptionSelected={field?.spec?.getOptionSelected}
              onChange={(e, value, reason) =>
                field?.spec?.handelChangeSelect(
                  e,
                  value,
                  reason,
                  field,
                  setSearch
                )
              }
              onInputChange={(e, value, reason) =>
                field?.spec?.onInput(e, value, reason, field, setSearch)
              }
              inputValue={search[field?.key] || field?.value || ""}
              value={field?.value}
              popupIcon={<ExpandMoreIcon />}
              renderOption={(option) => (
                <React.Fragment>
                  <Typography className={classes.labelOption}>
                    {field?.spec?.getOptionLabels(option)}
                  </Typography>
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
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
                          field?.spec?.inputEnd && classes.paddingInputEnd,
                          field?.spec?.inputEndRight &&
                            classes.paddingInputEndRight
                        )
                  }
                  label={field?.spec?.label}
                  error={field.dirty && !!field?.error}
                  helperText={field.dirty && field?.error}
                  onBlur={field.onBlur}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>
                        <InputAdornment
                          className={classes.placeholderBox}
                          position="start"
                        >
                          <Typography className={classes.placeholder}>
                            {!field?.value &&
                              !search[field?.key] &&
                              field?.spec?.placeholder}
                          </Typography>
                        </InputAdornment>
                        {params.InputProps.endAdornment}
                      </Fragment>
                    ),
                  }}
                  variant="outlined"
                />
              )}
            />
          );
        case "collapse":
          return (
            <Fragment>
              <Typography
                className={classes.title}
                onClick={() => setOpenAddressline2(!openAddressline2)}
              >
                + Address line 2 ( Optional )
              </Typography>
              <Collapse in={openAddressline2}>
                <TextField
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
                          field?.spec?.inputEnd && classes.paddingInputEnd,
                          field?.spec?.inputEndRight &&
                            classes.paddingInputEndRight
                        )
                  }
                  value={field?.value}
                  onChange={field?.onChange}
                  error={field.dirty && !!field?.error}
                  helperText={field.dirty && field?.error}
                  onBlur={field.onBlur}
                  label={field?.spec?.label}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        className={classes.placeholderBox}
                        position="start"
                      >
                        <Typography className={classes.placeholder}>
                          {!field?.value && field?.spec?.placeholder}
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Collapse>
            </Fragment>
          );
        case "divider":
          return <Divider className={classes.Divider} />;
        case "textPassword":
          return (
            <TextPassword
              classes={classes}
              field={field}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          );
        default:
          return (
            <TextField
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
                      field?.spec?.inputEnd && classes.paddingInputEnd,
                      field?.spec?.inputEndRight && classes.paddingInputEndRight
                    )
              }
              value={field?.value}
              onChange={field?.onChange}
              error={field.dirty && !!field?.error}
              helperText={field.dirty && field?.error}
              onBlur={field.onBlur}
              label={field?.spec?.label}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    className={classes.placeholderBox}
                    position="start"
                  >
                    <Typography className={classes.placeholder}>
                      {!field?.value && field?.spec?.placeholder}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          );
      }
    },
    [classes, openAddressline2, setOpenAddressline2, search, showPassword]
  );

  return (
    <Box>
      <Grid container>
        {fields?.map((field, index) => {
          return (
            <Grid
              key={index}
              xs={
                field?.spec?.widthonlyxs ||
                field?.spec?.widthxs ||
                field?.spec?.width * 2 ||
                field?.spec?.fullWidth ||
                12
              }
              sm={
                field?.spec?.widthxs ||
                field?.spec?.width ||
                field?.spec?.fullWidth ||
                6
              }
              item
            >
              {showContent(field)}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CommonInput;
