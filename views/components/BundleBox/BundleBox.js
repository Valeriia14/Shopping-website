import {
  Box,
  Container,
  Grid,
  makeStyles,
  Typography,
  Button,
  Link,
} from "@material-ui/core";
import React, { useCallback } from "react";
import { IconComponent } from "..";
import ArrowForward from "@material-ui/icons/ArrowForward";
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#F9F8F4",
    padding: "80px 0px",
    [theme.breakpoints.down("md")]: {
      padding: "48px 20px",
      paddingBottom: "6px",
    },
  },
  container: {
    padding: 0,
  },
  containerBox: {
    display: "flex",
    alignItems: "center",
    borderTop: "unset",
    [theme.breakpoints.down("md")]: {
      marginBottom: 42,
    },
    [theme.breakpoints.down("xs")]: {
      borderRight: "unset !important",
      alignItems: "flex-start",
      paddingTop: "30px",
      borderTop:"1px solid #000000"
    },
  },
  img: {
    height: "40px", 
    padding: "0 40px 0 60px",
    [theme.breakpoints.down("xs")]: {
      width: "135px",
      height: "100%",
      padding: "20px 10% 0px 5%",
    },
  },
  primaryTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    lineHeight: "24px",
    letterSpacing: "3px",
    marginBottom: "5px",
    textTransform: "uppercase",
    [theme.breakpoints.down("xs")]: {
      fontSize: "16px",
      lineHeight: "19px",
      letterSpacing: "2.4px",
    },
  },
  contentText: {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "17px",
    letterSpacing: "0.9px",
    marginBottom: "5px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
    },
  },
  buttonBox: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #000000",
    borderRadius: "unset",
    marginTop: "6px",
    display: "flex",
    maxWidth: "120px",
    justifyContent: "space-evenly",
    "& svg": {
      margin: "auto 0px",
    },
  },
  button: {
    borderRight: "1px solid",
    borderRadius: "unset",
    fontWeight: 600,
    fontSize: "9px",
    lineHeight: "11px",
    textAlign: "center",
    letterSpacing: "2.625px",
    whiteSpace: "nowrap"
  },
}));
const BundleBox = () => {
  const classes = useStyles();
  const data = [
    {
      imageName: "bundleDealIcon",
      title: "Bundle Deal",
      content: "Many attractive deals available",
      link: "",
      
    },
    {
      imageName: "signUpNowIcon",
      title: "SIGN UP NOW",
      content: "$5 credit when you sign up",
      link: "",
    },
    {
      imageName: "replacementIcon",
      title: "Free Straw",
      content: "Straw replacement for bottle",
      link: "",
    },
  ];
  const showContent = useCallback(() => {
    return data.map((item, index) => {
      return (
        <Grid key={index} xs={12} lg={4} item>
          <Box
            className={classes.containerBox}
            style={{
              borderRight:
                index == data.length - 1 ? "unset" : "1px solid #000000",
              borderTop: index == 0 ? "unset" : "",
            }}
          >
            <IconComponent
              className={classes.img}
              name={item.imageName}
              alt={item.imageName}
            />
            <Box>
              <Typography className={classes.primaryTitle}>
                {item.title}
              </Typography>
              <Typography className={classes.contentText}>
                {item.content}
              </Typography>
              <Link href={item.link || "#"} underline="none">
                <Box className={classes.buttonBox}>
                  <Button className={classes.button}>LEARN MORE </Button>
                  <ArrowForward fontSize="small" />
                </Box>
              </Link>
            </Box>
          </Box>
        </Grid>
      );
    });
  }, [data]); //eslint-disable-line
  return (
    <Box className={classes.root}>
      <Container className={classes.container} maxWidth="lg">
        <Grid container>{showContent()}</Grid>
      </Container>
    </Box>
  );
};

export default BundleBox;
