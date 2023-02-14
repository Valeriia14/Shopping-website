import { Box , Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const NotFoundPage = (props) => {
  const { title, ...rest } = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <Grid
        container
        className={classes.titleError}
        spacing={2}
        justifyContent="space-between"
      >
        <Box>{title}</Box>
      </Grid>
    </React.Fragment>
    
  );
};

const useStyles = makeStyles((theme) => ({
  titleError: {
    fontSize: theme.spacing(3),
    justifyContent: "center",
    alignContent: "center",
    height: "230px",
  },
}));

export default NotFoundPage;
