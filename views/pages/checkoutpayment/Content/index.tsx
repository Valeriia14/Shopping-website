import { Box, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import CheckOutBody from "./Components/CheckOutBody";
import {
  Typography,
} from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
  },
  subTitle: {
    marginBottom: theme.spacing(3)
  }
}));

export default (props: any) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Container maxWidth="lg">
        <CheckOutBody />
      </Container>
    </Box>
  );
}
