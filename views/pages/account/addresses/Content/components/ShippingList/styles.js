import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  shippingCardBox: {
    border: "1px solid #cdcbcb",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    padding: "40px 30px",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      margin: "8px 0px",
    },
  },
  shippingCardBoxDefaut: {
    border: "1px solid black",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    padding: "40px 30px",
    position: "relative",
    "& #cardActive": {
      display: "flex!important",
    },
  },
  cardBoxLeft: {
    margin: "0px 20px 20px 0px",
    [theme.breakpoints.down("xs")]: {
      margin: "0px 0px 20px 0",
    },
  },
  cardBoxRight: {
    margin: "0px 0px 20px 20px",
    [theme.breakpoints.down("xs")]: {
      margin: "0px 0px 20px 0",
    },
  },
  infoText: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "19px",
    textAlign: "left",
  },
  cardActive: {
    top: "8px",
    right: "8px",
    display: "none",
    position: "absolute",
    "& svg": {
      fill: "white",
    },
  },
  editButtonBox: {
    position: "absolute",
    right: "16px",
    bottom: "16px",
  },
  editButton: {
    padding: 4,
    minWidth: "fit-content",
    borderRadius: 25,
  },
  deleteButton: {
    marginLeft: "8px",
    padding: 4,
    minWidth: "fit-content",
    borderRadius: 25,
  },
  addnewbuttonBox: {
    height: 158,
    backgroundColor: "#F8F8F8",
    borderRadius: 9,
    display: "flex",
  },
  addButton: {
    width: "100%",
    textTransform: "none",
    borderRadius: 9,
    fontSize: "20px",
    fontWeight: 700,
    lineHeight: "23px",
    textAlign: "left",
  },
  typeText: {
    fontSize: "10px",
    fontWeight: 500,
    lineHeight: "12px",
    textAlign: "left",
    textTransform: "uppercase",
    color: "#333333",
    marginLeft: theme.spacing(2),
  },
  infoBox: {
    display: "flex",
    flexDirection: "column",
    minWidth: "50%",
    [theme.breakpoints.down("xs")]: {
      minWidth: "100%",
    },
  },
  popupBox: {
    "& .MuiDialogTitle-root": {
      padding: "40px 80px",
      "& h2": {
        fontSize: "24px",
        fontWeight: 700,
        lineHeight: "24px",
      },
      [theme.breakpoints.down("xs")]: {
        padding: "50px 24px 24px 24px",
        textAlign: "center",
      },
    },
    "& .MuiDialogContent-root": {
      padding: "0px 24px 40px 24px",
    },
  },
  popupCancelButton: {
    fontSize: "24px",
    fontWeight: 500,
    lineHeight: "28px",
    textAlign: "center",
    width: "200px",
    border: "1px solid",
    borderRadius: "0px",
    marginRight: 8,
  },
  popupDeleteButton: {
    fontSize: "24px",
    fontWeight: 500,
    lineHeight: "28px",
    textAlign: "center",
    width: "200px",
    borderRadius: "0px",
    marginLeft: 8,
    backgroundColor: "black",
    color: "white",
    "&:hover": {
      color: "white",
      backgroundColor: "black",
    },
  },
}));