import { Box, Typography, Grid, Button, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  buttonBox: {
    backgroundColor: "#000000",
    color: "white",
    borderRadius: "unset",
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    width: "200px",
    height: "50px",
    padding: 0,
  },
  pointText: {
    color: "black",
    fontWeight: "bold",
    fontSize: "16px",
    lineHeight: "28px",
  },
  box: {
    padding: "0 !important",
    height: "270px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: theme.spacing(5),
  },
  title: {
    fontWeight: "bold",
    fontSize: "20px",
    display: "flex",
    alignItems: "center",
    "& > img": {
      width: "20px",
      maxHeight: "20px",
      objectFit: "contain",
      marginRight: "5px",
    },
  },
  divider: {
    margin: theme.spacing(2, 0, 2.5),
    backgroundColor: "#000",
    height: "2px",
    border: "none",
    width: "100%",
  },
  centerContent: {
    margin: "auto 0",
  },
}));

const BoxDashboard = ({
  children,
  title,
  iconTitleSrc,
  onRedirect,
  buttonText,
  center,
}) => {
  const classes = useStyles({});
  return (
    <Grid item lg={6} xs={6} sm={12} md={6}>
      <Box className={classes.box}>
        <Typography variant="h3" mb={3} className={classes.title}>
          <img src={iconTitleSrc} alt="" />
          {title}
        </Typography>
        <Divider className={classes.divider} />
        <Grid container mt={2} className={center && classes.centerContent}>
          {children}
        </Grid>
        <Button className={classes.buttonBox} onClick={onRedirect}>
          {buttonText}
          <img
            style={{
              filter: "invert(100%)",
              marginLeft: "5px",
              width: "17px",
            }}
            src="/images/arrow_right.svg"
          />
        </Button>
      </Box>
    </Grid>
  );
};

export default BoxDashboard;
