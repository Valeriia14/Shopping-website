import { Box, IconButton, InputAdornment, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AddRounded, RemoveRounded } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";

const QuantityInput = (props) => {
  const { children, className, onChange, value, ...rest } = props;
  const classes = useStyles();

  const onTextFieldChange = (event) => {
    onChange?.(parseInt(event.target.value));
  };

  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      <TextField
        inputProps={{
          className: classes.input,
        }}
        type="number"
        variant="outlined"
        contentEditable={false}
        value={value}
        onChange={onTextFieldChange}
        onFocus={(e) => {
          e.target.select();
        }}
        InputProps={{
          className: classes.inputBase,
          startAdornment: (
            <InputAdornment position="start">
              <IconButton size="small" onClick={() => onChange?.(Math.max(1, (value ?? 0) - 1))} className={classes.button}>
                <RemoveRounded />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onChange?.((value ?? 0) + 1)} className={classes.button}>
                <AddRounded />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "&input::-webkit-outer-spin-button,input::-webkit-inner-spin-button": 
    {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "input[type=number]" : {
      "-moz-appearance": "textfield",
    }
  },
  button: {
    "& :hover": {
      color: theme.palette.primary.main,
    },
  },
  inputBase: {
    fontSize: theme.spacing(1.2),
    borderRadius: theme.spacing(42),
    paddingLeft: 3,
    paddingRight: 3,
  },
  input: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    width: "3em",
    fontSize: theme.spacing(2),
    textAlign: "center",
  },
}));

export default QuantityInput;
