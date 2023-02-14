import { BundleAndSave } from "@ktwebsite/components";
import { Box, Button, Container , Typography } from "@material-ui/core";
import HomeIcon from '@material-ui/icons/Home';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import doRedirect from "@ktwebsite/utils/doRedirect";

const useStyles = makeStyles((theme) => ({
  root: {
  },
  box: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh",
    backgroundColor: "#9898981f",
    boxShadow: "0px 0px 10px #0000004f",
    borderRadius: "20px 20px 0px 0px",
    marginTop: theme.spacing(2),
  },
  image :{
    width: "400px"
  },
  title :{
    fontSize : "20px",
    fontWeight:"bold",
    maxWidth: "39%",
    textAlign: "center",
    margin: "20px 0px",
    textTransform: "uppercase",
  },
  button :{
    backgroundColor: "#2e2965",
    padding: "10px",
    color: "#eeeeee",
    borderRadius: "25px",
    "&:hover":{
      backgroundColor: "#2b2662d4",
    },
    margin : "16px 0px",
  }
}));

export default (props: any) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container maxWidth="lg">
        <BundleAndSave />
        <Box className={classes.box}>
          <Typography className={classes.title}>Oops! Page Not Found</Typography>
          <img src="/images/404notfoundpage.png" className={classes.image}/>
          <Typography className={classes.title}>We are sorry ,but the page you requested was not found</Typography>
          <Button 
            className={classes.button} 
            onClick={() =>{doRedirect("/")}}
          >
            <HomeIcon/>&nbsp;Go to Home Page&nbsp;<ArrowForwardIcon/>
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
