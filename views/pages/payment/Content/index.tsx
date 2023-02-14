import { BundleAndSave } from "@ktwebsite/components";
import { Box, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import CheckOutBody from "./Components/CheckOutBody";

const useStyles = makeStyles((theme) => ({
  root: {
  },
}));


export default (props: any) => {
  const classes = useStyles();
 
  return (
    <Box className={classes.root}>
      <Container maxWidth="xl" disableGutters>
        <Box pt={2}>
          <BundleAndSave />
        </Box>

        <CheckOutBody/>
      </Container>
    </Box>
  );
}
