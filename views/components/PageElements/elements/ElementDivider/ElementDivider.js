import React from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.spacing(40),
    margin: 'auto',
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    border: '1px solid #bbb',
    mixBlendMode: 'normal',
    opacity: 0.4,
    [theme.breakpoints.down('sm')]: {
      width: "50%",
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
    },
  },
}));

const ElementDivider = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root} />
  )
}
export default ElementDivider;
