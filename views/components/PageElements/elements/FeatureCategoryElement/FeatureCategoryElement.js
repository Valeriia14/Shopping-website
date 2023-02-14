import { Box, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import { ExploreMoreProducts } from "./components";

const FeatureCategoryElement = (props) => {
  const { children, className, element, ...rest } = props;
  const classes = useStyles();

  if (!element) return null;

  return (
    <Container disableGutters maxWidth="lg" {...rest} className={clsx(classes.root, className)}>
      <Box className={classes.contents}>
        <Box className={classes.feature}>
          <Typography className={classes.title}>{element.options?.title}</Typography>
          <Typography className={classes.description}>{element.options?.description}</Typography>
        </Box>
        <Box className={classes.slider}>
          <ExploreMoreProducts categories={element.categories} />
        </Box>
      </Box>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {},
  contents: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexWrap: 'wrap',
    },
  },
  feature: {
    [theme.breakpoints.down('xs')]: {
      marginBottom: '40px',
    },
  },
  title: {
    border: '1px solid #2D2866',
    width: '327px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px',
    color: '#2D2866',
    fontWeight: 'normal',
    fontSize: '30px',
    lineHeight: '34px',
    [theme.breakpoints.down('md')]: {
      width: '175px',
      height: '46px',
      fontSize: '18px',
      lineHeight: '20px',
    },
  },
  description: {
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'center',
    letterSpacing: '0.444444px',
    [theme.breakpoints.down('xs')]: {
      marginTop: '10px',
      fontSize: '14px',
      lineHeight: '20px',
    },
  },
  slider: {
    textAlign: 'center',
    width: '70%',
    marginLeft: '70px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginLeft: 'unset',
    },
  },
}));

export default FeatureCategoryElement;
