import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { useState } from "react";
import WishList from "../WishList";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      width: "100%",
    },
  },
  textCapitalize: {
    textTransform: "capitalize",
    fontSize: "30px",
    fontWeight: 700,
    lineHeight: "35px",
    textAlign: "left",
    marginBottom: 8,
    [theme.breakpoints.down("sm")]: {
      fontSize: "24px",
      lineHeight: "28px",
      marginBottom: 0,
    },
  },
  textEarnPoint: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "19px",
    textAlign: "left",
  },
  textInform: {
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: "16px",
    textAlign: "left",
  },
  formControlLabel: {
    "& .MuiFormControlLabel-label": {
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: "14px",
      textAlign: "left",
      [theme.breakpoints.down("xs")]: {
        lineHeight: "20px",
        marginTop: 16,
      },
    },
  },
  icon: {
    color: "#1E3A3A!important",
  },
  updateButton: {
    backgroundColor: "black",
    color: "white",
    width: "245px",
    padding: "14px",
    borderRadius: "0px",
    fontSize: "18px",
    fontWeight: 500,
    lineHeight: "21px",
    textAlign: "center",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
    },
  },
  inputRoot: {
    color: "black",
  },
}));

const WishlistBody = () => {
  const classes = useStyles();
  const [wishList, setWishList] = useState([
    {
      id: 523,
      description:
        'Back To School Half Day Lite Backpack (12.5") Shimmer & Shine',
      price: "10.90",
      rate: 3,
      categories: ["new", "sale", "free gift"],
      discount: "",
      oldPrice: "",
    },
    {
      id: 524,
      description:
        'Back To School Half Day Lite Backpack (12.5") Shimmer & Shine',
      price: "10.90",
      rate: 3,
      categories: ["new", "sale", "free gift"],
      discount: "30%",
      oldPrice: "30.90",
    },
    {
      id: 525,
      description:
        'Back To School Half Day Lite Backpack (12.5") Shimmer & Shine',
      price: "10.90",
      rate: 3,
      categories: ["new", "sale", "free gift"],
      discount: "",
      oldPrice: "",
    },
  ]);

  return (
    <Box className={classes.root}>
      <Box pb={3}>
        <Typography className={classes.textCapitalize}>
          WISHLIST ( {wishList.length} )
        </Typography>
      </Box>
      <WishList wishList={wishList} handleDeleteItem={setWishList} />
    </Box>
  );
};

export default WishlistBody;
