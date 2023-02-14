import { Box, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "auto",
    minWidth: 400 - theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      minWidth: 290 - theme.spacing(2),
    },
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(1),
  },
  buttonRow: {
    display: "flex",
    flexDirection: "row",
  },
  button: {
    width: "50%",
    margin: theme.spacing(0.5),
    backgroundColor: "white",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "grey",
    },
  },
  buttonText: {
    fontSize: "18px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
    },
    fontWeight: 700,
    textTransform: "none",
    marginLeft: theme.spacing(1),
  },
  buttonIcon: {
    width: "20px",
    height: "20px"
  }
}));

const ActionSection = props => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.buttonRow}>
        <Button className={classes.button}>
          <img src="/images/box.svg" className={classes.buttonIcon} />
          <Typography className={classes.buttonText}>Orders</Typography>
        </Button>
        <Button className={classes.button}>
          <img src="/images/redemption-gift.svg" className={classes.buttonIcon} />
          <Typography className={classes.buttonText}>Redemption</Typography>
        </Button>
      </Box>
      <Box className={classes.buttonRow}>
        <Button className={classes.button}>
          <img src="/images/question.svg" className={classes.buttonIcon} />
          <Typography className={classes.buttonText}>FAQ</Typography>
        </Button>
        <Button className={classes.button}>
          <img src="/images/account-menu-contact-deep-purple.svg" className={classes.buttonIcon} />
          <Typography className={classes.buttonText}>Contact Us</Typography>
        </Button>
      </Box>
    </Box>
  );
}
export default ActionSection;