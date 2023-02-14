import { ProductGrid, ProductListing } from "@ktwebsite/components";
import { usePageData } from "@ktwebsite/hooks";
import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import LoadMore from "./components/LoadMore";
import SearchForm from "./components/SearchForm";
const useStyles = makeStyles((theme) => ({
  root: {
  },
  searchResultText: {
    color: "#666666",
    fontSize: "14px",
    marginTop: theme.spacing(3)
  },
  productGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  productResult: {
    width: "19%",
    marginLeft: "0.5%",
    marginRight: "0.5%",
    [theme.breakpoints.down("sm")]: {
      width: "32%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "48%",
      marginLeft: "1%",
      marginRight: "1%",
    }
  },
}));

export default (props: any) => {
  const classes = useStyles();
  const products = usePageData(data => data.products ?? []);
  const searchTerm = usePageData(data => data.searchTerm);

  return (
    <Box className={classes.root}>
      <Box pt={5} pb={5} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Grid container item lg={10} md={11} xs={11}>
          <SearchForm />
          <Grid item xs={12}>
            <Typography variant="body2" className={classes.searchResultText}>Search results for '{searchTerm}' (total: {products.length} products)</Typography>
          </Grid>
          <Grid item xs={12}>
            <ProductListing />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
