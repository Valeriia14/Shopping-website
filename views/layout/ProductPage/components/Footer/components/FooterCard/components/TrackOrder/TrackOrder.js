
import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box, OutlinedInput, InputAdornment, } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  trackOrderBoxMobile: {
    borderBottom: "1px solid #ccc",
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  trackOrderMobile: {
    color: theme.palette.primary.main
  },
  trackOrderSearch: {
    height: "30px",
    marginTop: "10px",
    background: "#eff0f4",
    borderRadius: "10px",
    padding: theme.spacing(1),
    width: "100%",
    fontSize: "16px"
  }
}));

const TrackOrder = props => {
  const classes = useStyles();

  return (
    <Fragment>
      <Box className={classes.trackOrderBoxMobile} pt={2} pb={3} mt={2} mb={2}>
        <Typography variant="h4" className={classes.trackOrderMobile}>TRACK YOUR ORDER</Typography>
        <OutlinedInput className={classes.trackOrderSearch}
          endAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>} />
      </Box>
    </Fragment>
  );
};

export default TrackOrder;
