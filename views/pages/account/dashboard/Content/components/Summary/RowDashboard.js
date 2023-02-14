import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  row: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px",
    background: "#F9F8F4",
    boxSizing: "border-box",
    marginBottom: theme.spacing(1),
    fontWeight: "600",
  },
  leftContent: {
    display: "flex",
    alignItems: "center",
  },
  imageItem: {
    marginRight: "10px",
    width: "20px",
    maxHeight: "20px",
    objectFit: "contain",
  },
  boldText: {
    fontWeight: "600",
    fontSize: "16px",
  },
}));

const RowDashboard = ({ urlImg, onRedirect, text }) => {
  const classes = useStyles();
  return (
    <Box className={classes.row} onClick={onRedirect}>
      <Box className={classes.leftContent}>
        <img src={urlImg} className={classes.imageItem} alt={text} />
        <Typography className={classes.boldText}>{text}</Typography>
      </Box>
      <img
        src="/images/arrow_right.svg"
        style={{ width: "17px" }}
        alt="arrow"
      />
    </Box>
  );
};

export default RowDashboard;
