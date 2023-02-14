import { Box, Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useMemo } from "react";
import About from "./components/About";
import Banner from "./components/Banner";
import FooterCard from "./components/FooterCard";
import ShopWithUs from "./components/ShopWithUs";
import { usePageData } from "@ktwebsite/hooks";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  flexRow: {
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  wrap: {
    marginTop: "40px",
    flexDirection: "column",
    display: "flex",
  },
  light: {
    width: "100%",
    height: "160px",
    background: "#EEEEEE"
  },
  dark: {
    width: "100%",
    height: "160px",
    background: "#E0E0E0"
  },
  title: {
    fontSize: "24px",
    lineHeight: "31px",
    marginTop: "10px",
    textTransform: "uppercase"
  },
  desc: {
    fontSize: "14px",
    lineHeight: "18px",
    marginTop: "6px",
  },
  bottomWrap:{
    background: "#828282",
    width: "100%",
    marginTop: "64px",
    padding: "150px 0 60px 0",
    [theme.breakpoints.down("sm")]: {
      marginTop: "50px",
      padding: "60px 0 45px 0",
    }
  },
  subWrap: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    display: "flex",
    paddingTop: "15px",
    [theme.breakpoints.down("sm")]: {
      "& p": {
        textAlign: "center",
        paddingTop: "3px",
      },
      paddingBottom: "45px"
    }
  },
  belowTitle: {
    color: "white",
    fontSize: "16px",
    lineHeight: "20px",
    marginBottom: "28px"
  },
  belowDesc: {
    fontSize: "14px",
    color: "white",
    lineHeight: "18px"
  },
  company: {
    marginTop: "80px"
  },
  middleWrap: {
    border: "solid 1px white",
    borderTop: "none",
    borderBottom: "none",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    "& p": {
      textAlign: "center"
    },
    padding: "15px 60px 55px 60px",
    [theme.breakpoints.down("sm")]: {
      border: "solid 1px white",
      borderLeft: "none",
      borderRight: "none",
      padding: "40px 60px 55px 60px",
    }
  },
  rightWrap: {
    paddingLeft: "60px",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "10px",
      paddingRight: "10px",
    }
  },
  whatsappWrap:{
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  numberWrap:{
    width: "70%",
    padding: "9px 21px 9px 21px!important",
    border: "solid 1px white",
    borderRadius: "5px",
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    justifyContent: "center",
    height: "48px",
    "& p": {
      textAlign: "left!important"
    }
  },
  descTxt: {
    fontSize: "10px",
    color: "white",
    lineHeight: "14px"
  },
  numTxt: {
    fontSize: "14px",
    color: "white",
    lineHeight: "14px"
  },
  btnGo:{
    height: "48px",
    background: "black",
    width: "23%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  goTxt:{
    fontSize: "18px",
    color: "white"
  }
}));

const Footer = (props) => {
  const classes = useStyles();
  
  return (
    <Box marginTop="25px" flexDirection="column" >
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={6} md={6}>
              <Box className={classes.wrap}>
                <Box className={classes.light}></Box>
                <Typography className={classes.title}>bundle deal</Typography>
                <Typography className={classes.desc}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillu.</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={6}>
              <Box className={classes.wrap}>
                <Box className={classes.dark}></Box>
                <Typography className={classes.title}>Refferal Programe</Typography>
                <Typography className={classes.desc}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillu.</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={6}>
              <Box className={classes.wrap}>
                <Box className={classes.dark}></Box>
                <Typography className={classes.title}>Join Us</Typography>
                <Typography className={classes.desc}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillu.</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={6}>
              <Box className={classes.wrap}>
                <Box className={classes.light}></Box>
                <Typography className={classes.title}>Free Straw</Typography>
                <Typography className={classes.desc}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillu.</Typography>
              </Box>
            </Grid>
        </Grid>
      </Container>
      <Box className={classes.bottomWrap}>
        <Container maxWidth="lg">
          <Grid container spacing={1} justifyContent="space-between">
              <Grid item xs={12} md={3}>
                <Box className={classes.subWrap}>
                  <Typography className={classes.belowTitle}>Contact Us</Typography>
                  <Typography className={classes.belowDesc}>Hotline : 12345678</Typography>
                  <Typography className={classes.belowDesc}>Whatsapp : 12345678</Typography>
                  <Typography className={classes.belowDesc}>Email : enquiry@kidztime.com</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className={clsx(classes.middleWrap)}>
                  <Typography className={classes.belowTitle}>Our Office Location</Typography>
                  <Typography className={classes.belowDesc}>Vendermac Distribution Pte Ltd 159 Sin Ming Rd, Singapore 575625</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box className={clsx(classes.subWrap, classes.rightWrap) }>
                  <Typography className={clsx(classes.belowTitle)}>Fresh arrivals, new and new-to-you brands, and expert edits. Basically, a bundle of joy send through your whatsapp.</Typography>
                  <Box className={classes.whatsappWrap}>
                    <Box className={classes.numberWrap}>
                      <Typography className={classes.descTxt} >Whatsapp Number</Typography>
                      <Typography className={classes.numTxt}>12345678</Typography>
                    </Box>
                    <Box className={classes.btnGo}>
                      <Typography className={classes.goTxt}>GO</Typography>
                    </Box>  
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box className={classes.subWrap}>
                  <Typography className={clsx(classes.company, classes.belowTitle)}>@ kidztime.com 2021</Typography>
                </Box>
              </Grid>
          </Grid>    
        </Container>
      </Box>
      
    </Box>
    
  );
};

export default Footer;
