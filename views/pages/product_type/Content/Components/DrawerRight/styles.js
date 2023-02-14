import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px",
    position: "relative",
  },
  drawer: {
    "& .MuiDrawer-paper": {
      width: "100vw!important",
      [theme.breakpoints.up("sm")]: {
        maxWidth: 350
      }
    }
  },
  subheaderTextLv1: {
    color: "black",
    display: "flex",
    padding: "16px 0px",
    fontSize: "20px",
    textAlign: "left",
    fontWeight: 700,
    lineHeight: "24px",
    borderBottom: "1px solid",
    marginBottom: "8px",
    alignItems: "center",
    justifyContent: "space-between",
    position: "inherit"
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
  titleFilter: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "19px",
    letterSpacing: "0px",
    textAlign: "left"
  },
  icon: {
    color: "#1E3A3A!important"
  },
  iconDisable :{
    color: "#939393!important"
  },
  checkBox: {
    padding: "5px 9px!important",
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
  priceText: {
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: "14px",
    textAlign: "left",
    color: "#1e3a3a"
  },
  formControlLabel: {
    "& .MuiFormControlLabel-label": {
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: "19px",
      textAlign: "left"
    },
    "& .MuiRadio-root": {
      padding: "5px 9px!important",
      color: "#1e3a3a!important"
    }
  },
  closeButton: {
    padding: "0",
    minWidth: "fit-content",
    borderRadius: "100px",
    position: "absolute",
    top: "36px",
    zIndex: 4
  },
  clearButton: {
    border: "1px solid",
    padding: "6px 8px",
    width: "330px",
    borderRadius: "8px",
    textTransform: "none",
  }
}));