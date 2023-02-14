import { BundleAndSave } from "@ktwebsite/components";
import { Box, Container, Hidden } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import ShippingMethodBoby from "./Components/ShippingMethodBoby";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("xs")] :{
      marginBottom : 80
    }
  },
}));

export default (props: any) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container maxWidth="lg">
        <Hidden xsDown={true}>
          <BundleAndSave />
        </Hidden>
        <ShippingMethodBoby />
      </Container>
    </Box>
  );
};
