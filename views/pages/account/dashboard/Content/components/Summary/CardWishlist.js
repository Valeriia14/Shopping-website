import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(() => ({
  boxImg: {
    marginRight: "30px",
    backgroundColor: "#f2f2f2",
    height: "90px",
    width: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0",
    cursor: "pointer",
  },
  img: {
    width: "55px",
    height: "55px",
    objectFit: "contain",
  },
  text: {
    fontSize: "14px",
  },
}));

const CardWishlist = ({ onRedirect, imgSrc, text, noMargin }) => {
  const classes = useStyles({});
  return (
    <Box
      onClick={onRedirect}
      className={classes.boxImg}
      style={noMargin ? { marginRight: "0" } : { marginRight: "30px" }}
    >
      {imgSrc ? (
        <img src={imgSrc} className={classes.img} alt="" />
      ) : (
        <Typography className={classes.text}>{text && text}</Typography>
      )}
    </Box>
  );
};

export default CardWishlist;
