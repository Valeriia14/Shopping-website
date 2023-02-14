import { KTImage } from "@ktwebsite/components";
import { Box, Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import { ProductSlider } from "./components";

const FeatureProductElement = (props) => {
  const { children, className, element, ...rest } = props;
  const classes = useStyles();

  return (
    <Container maxWidth="lg" {...rest} className={clsx(classes.root, className)}>
      <Grid container>
        <Grid item xs={12} md={4}>
          <Box className={classes.imageContainer}>
            <KTImage src={element.image} className={classes.image} />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography className={classes.description}>
            We have a bottle well suited for every kids.
            From toddlers to primary schools and beyond.
            Browse our range of bottle type to find the best for your kids.
          </Typography>
          <Box className={classes.sliderContainer}>
            <ProductSlider products={element?.products} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {},
  description: {
    textAlign: "center",
    margin: "0 auto",
    fontWeight: 600,
    maxWidth: "600px",
    fontSize: "16px",
    lineHeight: "20px",
    letterSpacing: "0.15px",
    marginBottom: "30px",
    [theme.breakpoints.down("xs")]: {
      marginTop: "10px",
      marginBottom: "30px",
    },
  },
  image: {
    width: "100%",
    borderRadius: "20px",
    objectFit: "cover",
    [theme.breakpoints.down("sm")]: {
      maxHeight: "240px",
    }
  },
  imageContainer: {
    marginRight: theme.spacing(8),
  },
  sliderContainer: {
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(0, -2),
    }
  },
}));

export default FeatureProductElement;
