import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    cursor: "pointer"
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  subheaderTextLv1: {
    color: "black",
    display: "flex",
    padding: "16px 0px",
    fontSize: "20px",
    borderTop: "1px solid",
    textAlign: "left",
    fontWeight: 700,
    lineHeight: "24px",
    borderBottom: "1px solid",
    marginBottom: "24px",
    alignItems: "center",
    justifyContent: "space-between",
    position: "inherit"
  },
  subheaderTextLv2: {
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "29px",
    letterSpacing: "0px",
    textAlign: "left",
    color: "black",
    padding: 0,
    position: "inherit"
  },
  active: {
    fontWeight: "700!important",
    fontSize: "20px!important",
    lineHeight: "24px!important",
    textAlign: "left",
    color: "#1E3A3A"
  },
  childText: {
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "19px",
    textAlign: "left",
    padding: "8px 0px"
  },
  childFilterText: {
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "19px",
    textAlign: "left",
    padding: "8px 0px",
    borderBottom: "1px solid"
  },
  clearButton: {
    padding: "8px 14px",
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "17px",
    border: "1px solid",
    borderRadius: "0px"
  },
  titleFilter: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "19px",
    letterSpacing: "0px",
    textAlign: "left"
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 0,
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: "19px",
      textAlign: "left"
    },
    "& .MuiSelect-select":{
      margin: "0px!important",
    }
  },
  icon: {
    color: "#1E3A3A!important"
  },
  iconDisable : {
    color: "#939393!important"
  },
  checkBox: {
    color: "#777373"
  },
  slider: {
    color: "#1E3A3A",
    "& :hover": {
      boxShadow: "none"
    },
    "& .MuiSlider-thumb": {
      backgroundColor: "white",
      border: "1px solid"
    },
    "& .MuiSlider-mark ": {
      height: 0
    },
    "& .Mui-focusVisible": {
      boxShadow: "none"
    }
  },
  priceText :{
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: "14px",
    textAlign: "left",
    color: "#1e3a3a"
  },
  formControlLabel:{
    "& .MuiFormControlLabel-label":{
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: "19px",
      textAlign: "left"
    }
  }
}));