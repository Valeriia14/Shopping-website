import { Box, InputBase, Typography, InputAdornment, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { GenericMessage } from "@ktwebsite/components";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1),
  },
  asterisk: {
    fontSize: "14px",
    color: "red",
    marginRight: theme.spacing(0.5),
  },
  titleWrap: {
    display: "flex",
    flexDirection: "row",
    top: "7px",
    left: "20px",
    position: "relative",
    zIndex: "1",
    height: 0
  },
  title: {
    fontSize: "10px",
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  inputRoot: {
    width: "100%",
    fontSize: "18px",
    background: "#eff0f4",
    border: "1px solid #A6A6A6",
    borderRadius: "4px",
  },
  inputInput: {
    padding: theme.spacing(1.5),
    width: "100%",
    fontSize: "14px",
    fontWeight: 500,
    backgroundColor: "white",
    borderRadius: "4px",
    paddingTop: "20px",
    paddingLeft: "20px",
  },
  eyeIcon: {
    fontSize: "18px",
    marginRight: theme.spacing(1.5),
  },
  button: {
    "&:hover": {
      backgroundColor: "transparent"
    },
  },
  message: {
    marginLeft: theme.spacing(1),
  }
}));

const BaseInput = props => {
  const classes = useStyles();
  const { className, fields, name, type, required, submitError, multiline = false, rows = 0, autoComplete, value, onChange, onBlur, placeholder, ...rest } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [field, setField] = useState({});

  useEffect(() => {
    setField(fields?.filter(f => f.key === name)[0] || {});
  }, [fields]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

// {required && <Typography className={classes.asterisk}>*</Typography>}
  return (
    <Box className={clsx(classes.root, className)}>
      <Box className={classes.titleWrap}>
        <Typography className={classes.title}>{field.spec?.label || ""}</Typography>
      </Box>
      <InputBase
        {...rest}
        type={!showPassword && type === "password" ? "password" : "text"}
        value={value || field.value  || ""}
        onChange={onChange || field.onChange || null}
        onBlur={(e)=>{
          onBlur(e);
          field?.onBlur()
        }}
        placeholder={placeholder || field.spec?.placeholder || ""}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        endAdornment={type === "password" && (
          <InputAdornment position="end">
            <IconButton
              disableRipple
              className={classes.button}
              aria-label="toggleVisibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end">
              {showPassword ? <VisibilityIcon className={classes.eyeIcon} /> : <VisibilityOffIcon className={classes.eyeIcon} />}
            </IconButton>
          </InputAdornment>)}
        inputProps={
          autoComplete? 
          { 
            "aria-label": "search", 
            autoComplete: "new-password"
          } : 
          {
            "aria-label": "search", 
          }
        }
        multiline={multiline}
        minRows={rows} />
      {(field.dirty || submitError) && field.error && <GenericMessage error className={classes.message} message={field.error} />}
    </Box>
  );
};

export default BaseInput;
