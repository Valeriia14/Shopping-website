import {
  Box,
  Typography,
  Grid,
  Hidden,
  InputBase,
  TextField,
  InputAdornment,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment, useEffect, useState } from "react";
import { BaseButton } from "@ktwebsite/components";
import clsx from "clsx";
import useApi from "@ktwebsite/utils/api/useApi";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";

const useStyles = makeStyles((theme) => ({
  root: {},
  subTitle: {
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: "19px",
    padding: theme.spacing(1, 0),
  },
  radioButton: {
    fontWeight: "bold",
    fontSize: "16px",
    lineHeight: "20px",
    color: "#000000",
    "&.Mui-checked": {
      color: "#000000",
    },
  },
  productImageBox: {
    backgroundColor: "#D8D8D8",
    width: "65px",
    height: "86px",
    marginTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  productImage: {
    width: "inherit",
    height: "inherit",
  },
  descriptionText: {
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "20px",
  },
  displayFlex: {
    display: "flex",
  },
  Divider: {
    margin: "12px 0px",
    backgroundColor: "#D5D5D5",
  },
  buttonSelectedText: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#FFFFFF",
  },
  buttonSelected: {
    color: "white",
    backgroundColor: "black",
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    "&:hover": {
      backgroundColor: "#1565C0",
    },
    width: 100,
    height: 30,
    [theme.breakpoints.down("md")]: {
      width: 180,
      height: 30,
    },
  },
  button: {
    width: 100,
    height: 30,
    color: "black",
    backgroundColor: "white !important",
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    border: "1px solid #000000",
    boxSizing: "border-box",
    "&:hover": {
      backgroundColor: "#1565C0",
    },
    [theme.breakpoints.down("md")]: {
      width: 180,
      height: 30,
    },
  },
  buttonText: {
    fontSize: "14px",
    fontWeight: 700,
    color: "black",
  },
  productsBox: {
    height: "40vh",
    overflowX: "hidden",
    overflowY: "scroll",
    marginTop: theme.spacing(3),
    width: "90%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  inputSearch: {
    boxSizing: "border-box",
    "& .MuiOutlinedInput-input": {
      padding: "23px 14px 18px 20px",
      zIndex: 1,
      fontSize: "14px",
    },
    "& .MuiOutlinedInput-adornedEnd": {
      paddingRight: 0,
    },
    "& .MuiOutlinedInput-multiline": {
      padding: 0,
    },
    width: "90%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  inputPlaceholder: {
    fontSize: "14px",
    "&::placeholder": {
      color: "#1D1D1D",
      fontWeight: 500,
    },
  },
  searchIcon: {
    fontSize: "14px",
    color: "white",
    marginRight: theme.spacing(2),
  },
}));

const SearchCatalogue = (props) => {
  const classes = useStyles({});
  const [search, setSearch] = useState("");
  const { item, onSelect } = props;
  const [itemsCatalogue, setItemsCatalogue] = useState([]);
  const [items, setItems] = useState([]);
  const api = useApi();
  const [getProducts, loading, error] = useAsyncTask("getProducts");
  const getProductList = () => {
    getProducts(async () => {
      const response = await api.path("public/product/list").get();
      const res = response.data.result ? response.data.result.models : [];
      setItemsCatalogue(res);
      setItems(res);
    });
  };
  useEffect(() => {
    getProductList();
  }, []);
  const onSearchChange = (search) => {
    setSearch(search);
    if (search) {
      const stringSearch = search.toLowerCase().trim().toString();
      const filterItems = itemsCatalogue.filter(
        (item) => item.name.toLowerCase().trim().indexOf(stringSearch) !== -1
      );
      setItemsCatalogue(filterItems);
    } else {
      setItemsCatalogue(items);
    }
  };
  const [itemSelected, setItemSelected] = useState();

  return (
    <Box className={classes.root} width="100%">
      <Box mt={3}>
        <Grid container>
          <Grid item lg={12} md={12} xs={12} sm={12}>
            <TextField
              variant="outlined"
              placeholder="Search catalogue"
              className={clsx(classes.inputSearch)}
              onChange={(e) => {
                onSearchChange(e.target.value);
              }}
              value={search}
              InputProps={{
                classes: {
                  input: classes.inputPlaceholder,
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <img
                      src="/images/search-icon.svg"
                      className={classes.searchIcon}
                      width={"25px"}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.productsBox}>
        {itemsCatalogue &&
          itemsCatalogue.map((item, index) => (
            <Fragment key={index}>
              <Grid container spacing={2}>
                <Grid
                  item
                  lg={8}
                  md={8}
                  xs={12}
                  sm={12}
                  className={classes.displayFlex}
                >
                  <Grid item lg={2} xs={3} md={2} sm={2}>
                    <Box className={classes.productImageBox}>
                      {item.preview && (
                        <img
                          src={item.preview.uri}
                          className={classes.productImage}
                          alt="design"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item lg={10} xs={9} md={10} sm={10}>
                    <Box display="flex" direction="row">
                      <Typography className={classes.subTitle}>
                        {item.name}
                      </Typography>
                    </Box>
                    <Typography className={classes.descriptionText}>
                      Design: Paw Patrol
                    </Typography>
                    <Typography className={classes.descriptionText}>
                      Add on Caps: None
                    </Typography>
                    <Typography className={classes.descriptionText}>
                      Add on Straw: None
                    </Typography>
                    <Hidden mdUp>
                      <Box>
                        <Typography className={classes.subTitle} mt={1}>
                          $
                          {typeof item.price === "number"
                            ? item.price.toFixed(2)
                            : "-"}
                        </Typography>
                        <BaseButton
                          buttonClassName={
                            itemSelected?.id == item.id
                              ? classes.buttonSelected
                              : classes.button
                          }
                          text="SELECT"
                          onClick={() => {
                            setItemSelected(item);
                            onSelect(item);
                          }}
                          textClassName={
                            itemSelected?.id == item.id
                              ? classes.buttonSelectedText
                              : classes.buttonText
                          }
                        />
                      </Box>
                    </Hidden>
                  </Grid>
                </Grid>
                <Hidden mdDown>
                  <Grid item lg={1} xs={1} md={1} sm={1}>
                    <Typography className={classes.subTitle}>
                      $
                      {typeof item.price === "number"
                        ? item.price.toFixed(2)
                        : "-"}
                    </Typography>
                  </Grid>
                  <Grid item lg={3} xs={3} md={3} sm={3}>
                    <BaseButton
                      buttonClassName={
                        itemSelected?.id == item.id
                          ? classes.buttonSelected
                          : classes.button
                      }
                      text="SELECT"
                      onClick={() => {
                        setItemSelected(item);
                        onSelect(item);
                      }}
                      textClassName={
                        itemSelected?.id == item.id
                          ? classes.buttonSelectedText
                          : classes.buttonText
                      }
                    />
                  </Grid>
                </Hidden>
              </Grid>
              <Divider className={classes.Divider} />
            </Fragment>
          ))}
      </Box>
    </Box>
  );
};

export default SearchCatalogue;
