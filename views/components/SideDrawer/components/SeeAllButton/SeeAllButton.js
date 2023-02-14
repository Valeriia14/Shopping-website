import { Box, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-end"
  },
  shadow: {
    width: theme.spacing(1) + 115,
    height: theme.spacing(1) + 105,
    borderRadius: "10px",
    boxShadow: "0 1px 3px 0 rgba(77,95,111,.3)",
  },
  buttonPadding: {
    width: theme.spacing(1) + 115,
    height: theme.spacing(1) + 105,
    border: "1px solid transparent",
    borderRadius: "10px",
    "&:hover": {
      backgroundColor: "lightgrey",
      border: "1px solid transparent",
    },
  },
  button: {
    display: "flex",
    flexDirection: "row",
    width: 115,
    height: 105,
    borderRadius: "10px",
    border: "3px solid",
    padding: theme.spacing(2),
    margin: theme.spacing(0.5),
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      border: "3px solid",
      padding: theme.spacing(2),
      margin: theme.spacing(0.5),
    },
  },
  buttonText: {
    fontSize: "16px",
    fontWeight: 600,
  },
  buttonIcon: {
    fontSize: "16px",
    marginLeft: theme.spacing(0.5),
  },

}));

const SeeAllButton = props => {
  const { onClick } = props;
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <div className={classes.shadow}>
        <div className={classes.buttonPadding}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={onClick}>
            <Typography className={classes.buttonText}>See all</Typography>
            <ArrowForwardIosIcon className={classes.buttonIcon} />
          </Button>
        </div>
      </div>
    </Box>
  );
}

export default SeeAllButton;