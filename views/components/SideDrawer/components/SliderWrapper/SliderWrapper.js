import { List, Slide } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import AccountListItem from "../AccountListItem";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 150,
    minWidth: 400,
    width: 400,
    [theme.breakpoints.down("xs")]: {
      minWidth: 300,
      width: 300,
    },
  },

}));

const SliderWrapper = props => {
  const { onClick, direction, slideIn, children } = props;
  const classes = useStyles();

  return (
    <Slide direction={direction} in={slideIn} mountOnEnter unmountOnExit>
      <List className={classes.root}>
        {direction === "right" && <AccountListItem onClick={onClick} />}
        {children}
      </List>
    </Slide>
  );
}

export default SliderWrapper;