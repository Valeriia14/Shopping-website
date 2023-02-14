import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: "80px",
    [theme.breakpoints.down("xs")]: {
      paddingLeft: "0",
    },
  },
  img: {
    width: "100%",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      padding: "8px",
    },
  },
  tagsBox: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 24,
  },
  tagText: {
    padding: "6px 10px",
    marginRight: "8px",
    fontSize: "10px",
    fontWeight: 700,
    lineHeight: "12px",
    letterSpacing: "0px",
    textAlign: "left",
    color: "white",
    marginBottom: 8,
  },
  titleName: {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "23px",
    textAlign: "left",
    wordBreak: "break-word",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    maxHeight: "68px",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
  },
  pink: {
    backgroundColor: "#F4C0C0",
  },
  blue: {
    backgroundColor: "#618CAC",
  },
  red: {
    backgroundColor: "#ED7777",
  },
  button: {
    width: "300px",
    fontSize: "18px",
    fontWeight: 500,
    lineHeight: "22px",
    textAlign: "center",
    backgroundColor: "#1e3a3a",
    color: "white",
    borderRadius: "0px",
    textDecoration: "none",
    padding: "10px",
    "&:hover": {
      backgroundColor: "#1e3a3a",
    },
  },
  limitText: {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "23px",
    textAlign: "center",
    marginTop: "16px",
    marginBottom: "160px",
    color: "#AEA691",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "32px",
    },
  },
  productBox: {
    paddingRight: 24,
    paddingBottom: 8,
    [theme.breakpoints.down("xs")]: {
      paddingRight: 0,
      paddingBottom: 8,
    },
  },
  commentText: {
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: "14px",
    textAlign: "left",
  },
  rating: {
    fontSize: 15,
    alignItems: "center",
  },
  price: {
    fontSize: "18px",
    color: "#000000",
    lineHeight: "22px",
    fontWeight: 600,
  },
  discountPercent: {
    "& p": {
      fontSize: "18px",
      color: "#D20000",
      lineHeight: "22px",
      fontWeight: 600,
    },
    marginLeft: "auto",
  },
  salePrice: {
    marginLeft: "15px",
    fontSize: "16px",
    lineHeight: "20px",
    color: "#7B7B7B",
    textDecoration: "line-through",
    textDecorationColor: "#7B7B7B",
  },
  priceBox: {
    flexDirection: "row",
    display: "flex",
    height: "38px",
    alignItems: "baseline",
    marginTop: "10px",
    marginBottom: "26px",
  },
}));
