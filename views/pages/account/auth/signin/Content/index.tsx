import { useSelfAccount } from "@ktwebsite/hooks";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { Box, Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import SignInForm from "./components/SignInForm";
import { BundleBox } from "@ktwebsite/components";
const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default (props: any) => {
  const classes = useStyles();
  const self = useSelfAccount();

  useEffect(() => {
    if (self) doRedirect("/account/dashboard");
  }, [self]);

  return (
    <Box className={classes.root}>
      <Container maxWidth="xl" disableGutters>
        <Grid item xs={12} md={12}>
          <SignInForm />
        </Grid>
      </Container>
      <BundleBox />
    </Box>
  );
};
