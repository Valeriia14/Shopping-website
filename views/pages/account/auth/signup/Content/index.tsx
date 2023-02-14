import { Box, Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import SignUpForm from "./components/SignUpForm";
import { BundleBox } from "@ktwebsite/components";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default (props: any) => {
  const classes = useStyles({});

  return (
    <Box className={classes.root}>
      <Container maxWidth="xl" disableGutters>
        <Grid item xs={12} md={12}>
          <SignUpForm />
        </Grid>
      </Container>
      <BundleBox />
    </Box>
  );
};
