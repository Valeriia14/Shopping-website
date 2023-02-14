import {
  Box,
  Container,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React, { useCallback } from "react";
import { IconComponent } from "..";
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      marginBottom: 42,
    },
    [theme.breakpoints.down("xs")]: {
      alignItems: "flex-start",
    },
  },
  img: {
    height: 64,
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      height: "100%",
    },
  },
  primaryTitle: {
    fontSize: "24px",
    fontWeight: 700,
    lineHeight: "29px",
    textAlign: "center",
    marginBottom: "8px",
    marginTop: "24px",
    textTransform: "uppercase",
    [theme.breakpoints.down("xs")]: {
      fontSize: "16px",
      textAlign: "left",
    },
  },
  contentText: {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "17px",
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
      textAlign: "left",
    },
  },
  left: {
    [theme.breakpoints.down("md")]: {
      paddingRight: 10,
    },
  },
  right: {
    [theme.breakpoints.down("md")]: {
      paddingLeft: 10,
    },
  },
}));
const ContactBox = () => {
  const classes = useStyles();
  const data = [
    {
      imageName: "bundleIcon",
      title: "Bundle Deal",
      content:
        "Duis aute irure dolor in reprehenderit in voluptate velit essecillu.",
      position: classes.left,
    },
    {
      imageName: "freeStrawICon",
      title: "Referral Program",
      content:
        "Duis aute irure dolor in reprehenderit in voluptate velit essecillu.",
      position: classes.right,
    },
    {
      imageName: "joinUsIcon",
      title: "SIGN UP NOW",
      content:
        "Duis aute irure dolor in reprehenderit in voluptate velit essecillu.",
      position: classes.left,
    },
    {
      imageName: "referralIcon",
      title: "Free Straw",
      content:
        "Duis aute irure dolor in reprehenderit in voluptate velit essecillu.",
      position: classes.right,
    },
  ];
  const showContent = useCallback(() => {
    return data.map((item, index) => {
      return (
        <Grid key={index} xs={6} lg={3} item>
          <Box className={clsx(classes.containerBox, item?.position)}>
            <IconComponent
              className={classes.img}
              name={item.imageName}
              alt={item.imageName}
            />
            <Typography className={classes.primaryTitle}>
              {item.title}
            </Typography>
            <Typography className={classes.contentText}>
              {item.content}
            </Typography>
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

export default ContactBox;
