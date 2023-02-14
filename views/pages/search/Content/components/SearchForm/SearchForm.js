import { Box, Grid, Typography, InputBase } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment, useState } from "react";
import { BaseButton, BaseInput } from "@ktwebsite/components";
import SearchIcon from '@material-ui/icons/Search';
import { usePageData } from "@ktwebsite/hooks";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import doRedirect from "@ktwebsite/utils/doRedirect";


const useStyles = makeStyles((theme) => ({
  searchTitle: {
    fontSize: "30px",
    fontWeight: 600
  },
  searchInputBox: {
    border: "1px solid #ccc",
    borderTopLeftRadius: "30px",
    borderBottomLeftRadius: "30px"
  },
  searchIcon: {
    marginTop: "7px",
    marginLeft: "10px",
    marginRight: "10px",
    width: "20px",
    height: "20px",
    opacity: 0.6,
  },
  searchInput: {
    width: "calc(100% - 20px)",
    fontSize: "16px"
  },
  searchBtn: {
    backgroundColor: "#c1454f",
    borderTopRightRadius: "30px",
    borderBottomRightRadius: "30px",
    "&:hover" : {
      backgroundColor: "#b7000f",
    }
  },
  searchText: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#fff",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
}));

const SearchForm = props => {
  const classes = useStyles({});
  const currentSearchTerm = usePageData(data => data.searchTerm);
  const [searchTerm, setSearchTerm] = useState(currentSearchTerm);

  const handleSubmit = (event) => {
    event && event.preventDefault();
    doRedirect(`/search?search=${searchTerm}`);
  };

  const onHandleChangeSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Fragment>
      <Grid item xs={12}>
        <Typography variant="h2" className={classes.searchTitle}>Search Kidztime!</Typography>
      </Grid>
      <Grid item xs={12}>
        <Box mt={3} display="flex" flexDirection="row">
          <Box flex="1" display="flex" flexDirection="row" className={classes.searchInputBox}>
            <SearchIcon className={classes.searchIcon} />
            <InputBase
              name='search'
              className={classes.searchInput}
              value={searchTerm}
              onChange={onHandleChangeSearchTerm}
              onKeyPress={(event) => {
               const keyCode = event.which || event.charCode || event.keyCode || 0; // detect Enter
               if (keyCode == 13) handleSubmit(event);
              }}
            />
          </Box>
          <BaseButton
            onClick={handleSubmit}
            buttonClassName={classes.searchBtn}
            text="Search" textClassName={classes.searchText} />
        </Box>
      </Grid>
    </Fragment>
  );
};

export default SearchForm;
