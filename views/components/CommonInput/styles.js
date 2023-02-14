import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  textField: {
    boxSizing: "border-box",
    "& .MuiOutlinedInput-input": {
      padding: "23px 14px 18px 20px",
      zIndex: 1,
      fontSize: "14px",
      fontFamily: "Barlow-Medium",
    },
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: 0,
    },
    "& .MuiOutlinedInput-multiline": {
      padding: 0,
    },
  },
  autoComplete: {
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: "38px !important",
    },
    "& .MuiOutlinedInput-input": {
      padding: "13.5px 4px 9.5px 11px !important",
      zIndex: 1,
      fontSize: "14px",
      fontFamily: "Barlow-Medium",
    },
    "& .MuiAutocomplete-endAdornment": {
      right: "10px",
      top: "18px",
    },
    "& .MuiAutocomplete-clearIndicator": {
      display: "none",
    },
  },
  placeholderBox: {
    position: "absolute",
    left: 20,
    top: 30,
    zIndex: 0,
    color: "#CACACA",
  },
  placeholder: {
    fontSize: 14,
  },
  inputLeft: {
    padding: "8px 8px 8px 0px",
    width: "100%",
    "& .MuiInputLabel-outlined": {
      transform: "translate(20px, 16px) scale(1)",
      fontSize: "10px",
    },
    "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
      transform: "translate(20px, 2px) scale(0.75)",
      fontSize: "14px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "8px 0px",
    },
  },
  inputRight: {
    padding: "8px 0px 8px 8px",
    width: "100%",
    "& .MuiInputLabel-outlined": {
      transform: "translate(28px, 16px) scale(1)",
      fontSize: "10px",
    },
    "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
      transform: "translate(28px, 2px) scale(0.75)",
      fontSize: "14px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "8px 0px",
      "& .MuiInputLabel-outlined": {
        transform: "translate(20px, 16px) scale(1)",
        fontSize: "10px",
      },
      "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
        transform: "translate(20px, 2px) scale(0.75)",
        fontSize: "14px",
      },
    },
  },
  inputFullWidth: {
    padding: "8px 0px",
    width: "100%",
    "& .MuiInputLabel-outlined": {
      transform: "translate(20px, 16px) scale(1)",
      fontSize: "10px",
    },
    "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
      transform: "translate(20px, 2px) scale(0.75)",
      fontSize: "14px",
    },
  },
  paddingInputEnd: {
    paddingRight: 8,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 16,
      paddingRight: 0,
      "& .MuiInputLabel-outlined": {
        transform: "translate(36px, 16px) scale(1)",
        fontSize: "10px",
      },
      "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
        transform: "translate(36px, 2px) scale(0.75)",
        fontSize: "14px",
      },
    },
  },
  paddingInputEndRight: {
    paddingLeft: 16,
    "& .MuiInputLabel-outlined": {
      transform: "translate(36px, 16px) scale(1)",
      fontSize: "10px",
    },
    "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
      transform: "translate(36px, 2px) scale(0.75)",
      fontSize: "14px",
    },
  },
  Divider: {
    margin: "24px 0px",
  },
  title: {
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: 700,
  },
  labelOption: {
    fontSize: "14px",
    fontFamily: "Barlow-Medium",
  },
}));
