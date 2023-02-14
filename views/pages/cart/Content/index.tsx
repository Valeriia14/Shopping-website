import { NavBreadcrumbs } from "@ktwebsite/components";
import { Box, Container, Hidden } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import CartBody from "./Components/CartBody";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "50px 0px"
  },
}));

export default (props: any) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container maxWidth="lg">
        <Hidden xsDown={true}>
          <NavBreadcrumbs
            firstTitle="Home"
            firstLink="/"
            finalTitle="BAG"
          />
        </Hidden>
        <CartBody />
      </Container>
    </Box>
  );
}
