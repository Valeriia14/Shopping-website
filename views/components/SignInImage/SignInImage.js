import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "600px",
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    paddingRight: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
  },
  imageWrap: {
    maxHeight: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  signInImg: {
    width: "100%",
    maxHeight: "200px",
    maxWidth: "200px",
    marginBottom: theme.spacing(3),
  },
  imageText: {
    fontSize: "14px",
    fontWeight: 600,
    color: theme.palette.primary.dark,
    textAlign: "center",
    textTransform: "uppercase",
  },
}));

const SignInImage = props => {
  const classes = useStyles();
  const { imageArray, imageTextArray } = props;

  return (
    <Grid container item xs={6} spacing={4} className={classes.root}>
      {imageArray.map((item, index) => (
        <Grid item xs={6} key={item} className={classes.imageWrap}>
          <Box height={200} width={200} display="flex" alignItems="center">
            <img src={item} className={classes.signInImg} />
          </Box>
          <Typography className={classes.imageText}>{imageTextArray[index]}</Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default SignInImage;