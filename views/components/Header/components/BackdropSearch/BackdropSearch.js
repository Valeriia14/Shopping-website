import doRedirect from "@ktwebsite/utils/doRedirect";
import { Box, Button, InputBase } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchBarBackdropWrap: {
    position: "relative",
    width: "100%",
    height: "50px",
    backgroundColor: "white",
    borderRadius: "40px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing(0, 2),
  },
  inputBackdropRoot: {
    fontSize: "18px",
    width: "100%",
  },
  inputBackdropInput: {
    paddingRight: theme.spacing(2),
    width: "100%",
  },
  backdropSearchIcon: {
    fontSize: "18px",
    color: theme.palette.primary.main,
  },
}));

const BackdropSearch = (props) => {
  const classes = useStyles();
  const { onClick } = props;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let mounted = true;
    return () => (mounted = false);
  }, []);

  const handleSubmitSearch = () => {
    doRedirect(`/search?search=${searchTerm}`);
  };

  const onHandleChangeSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box className={classes.root}>
      <Button color="inherit" onClick={onClick}>
        <ArrowBackIosIcon />
      </Button>
      <Box className={classes.searchBarBackdropWrap}>
        <InputBase
          placeholder="What are you looking for?"
          classes={{
            root: classes.inputBackdropRoot,
            input: classes.inputBackdropInput,
          }}
          onChange={onHandleChangeSearchTerm}
          onKeyPress={(event) => {
            const keyCode = event.which || event.charCode || event.keyCode || 0; // detect Enter
            if (keyCode == 13) {
              event && event.preventDefault();
              handleSubmitSearch();
            }
          }}
          inputProps={{ "aria-label": "search" }}
        />
        <SearchIcon className={classes.backdropSearchIcon} />
      </Box>
    </Box>
  );
};

export default BackdropSearch;
