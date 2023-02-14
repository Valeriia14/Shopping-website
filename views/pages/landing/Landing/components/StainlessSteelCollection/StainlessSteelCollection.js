import {
  Box,
  Grid,
  makeStyles,
  Typography,
  Button,
  Link,
  Hidden,
} from "@material-ui/core";
import React from "react";
import ProductListing from "./ProductListing";
import ProductListingExtra from "./ProductListingExtra";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "172px 0px",
    [theme.breakpoints.down("xs")]: {
      padding: "51px 0px",
    },
  },
  container: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  title: {
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "30px",
    letterSpacing: "2.9px",
    color: "#000000",
    textAlign: "center",
    fontStyle: "normal",
    [theme.breakpoints.down("xs")]: {
      textAlign: "left",
      fontSize: "10px",
      letterSpacing: "2.41667px",
    },
  },
  subTitle: {
    fontFamily: "Cormorant-SemiBold",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "30px",
    lineHeight: "40px",
    textAlign: "center",
    marginTop: "5px",
    [theme.breakpoints.down("xs")]: {
      textAlign: "left",
      fontSize: "25px",
    },
  },
  text: {
    marginTop: "10px",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "25px",
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      textAlign: "left",
      fontSize: "14px",
      lineHeight: "18px"
    },
  },
  bannerBox: {
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      position: "unset",
    },
  },
  banner: {
    position: "absolute",
    top: "161px",
    left: "25%",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      left: "50%",
      transform: "translate(-50%)",
    },
    [theme.breakpoints.down("xs")]: {
      position: "unset",
      left: "unset",
      transform: "unset",
      display: "unset",
    },
  },
  button: {
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "19px",
    textAlign: "center",
    textTransform: "uppercase",
    backgroundColor: "#000000",
    color: "#FFFFFF",
    marginLeft: "15%",
    padding: "14px 33px",
    borderRadius: 0,
    [theme.breakpoints.down("md")]: {
      marginLeft: "unset",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "unset",
      borderTop: "1px solid #000000",
      borderBottom: "1px solid #000000",
    },
  },
  link: {
    marginTop: "35px",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
    },
    [theme.breakpoints.down("xs")]: {
      justifyContent: "flex-start",
      borderTop: "1px solid #000000",
      borderBottom: "1px solid #000000",
      padding: "14px 0px",
      marginBottom: "14px",
      marginTop: "14px",
    },
  },
  bannerImg: {
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  bannerImgMdUp: {
    width: "100%",
    marginBottom: "20px",
  },
}));

const StainlessSteelCollection = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <Grid container>
          <Grid
            item
            lg={4}
            md={12}
            sm={12}
            xs={12}
            className={classes.bannerBox}
          >
            <Hidden mdDown>
              <img className={classes.bannerImg} src="/images/FA-4233.png" />
            </Hidden>
            <Hidden xsDown lgUp>
              <img
                className={classes.bannerImgMdUp}
                src="/images/FA-4233-mobile.svg"
              />
            </Hidden>
            <Box className={classes.banner}>
              <Typography className={classes.title}>
                STAINLESS STEEL BOTTLES
              </Typography>
              <Typography className={classes.subTitle}>
                Great for Rough kids
              </Typography>
              <Typography className={classes.text}>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat.
              </Typography>
              <Box className={classes.link}>
                <Button className={classes.button}>SHOP COLLECTION</Button>
              </Box>
              <Hidden smUp>
                <img
                  className={classes.bannerImg}
                  src="/images/FA-4233-mobile.svg"
                />
              </Hidden>
            </Box>
          </Grid>
          <Hidden mdDown>
            <Grid item lg={8} md={8} sm={12} xs={12}>
              <ProductListing />
            </Grid>
          </Hidden>
        </Grid>
        <ProductListingExtra />
      </Box>
    </Box>
  );
};

export default StainlessSteelCollection;
