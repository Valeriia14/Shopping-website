import {
  Box,
  Grid,
  Hidden,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import FilterProductTab from "../FilterProductTab";
import { IconComponent , ProductList } from "@ktwebsite/components";
import DrawerRight from "../DrawerRight";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import { useModel, usePageData } from "@ktwebsite/hooks";
import useApi from "@ktwebsite/utils/api/useApi";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    marginBottom: "24px",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  titleFilter: {
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: "23px",
    textAlign: "center",
    textTransform: "uppercase"
  },
  amountFilter: {
    backgroundColor: "#1e3a3a",
    color: "white",
    borderRadius: "100px",
    height: "20px",
    width: "20px",
    fontSize: "12px",
    fontWeight: 500,
    textAlign: "center",
  },
  dropDownBox :{
    top: "35px",
    width: "100vw",
    height: "max-content",
    position: "absolute",
    background: "#fafafa",
    padding: "16px",
    boxShadow: "2px 3px 8px #000000a8"
  },
  subheaderTextLv2: {
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "29px",
    letterSpacing: "0px",
    textAlign: "left",
    color: "black",
    padding: 0,
    position: "inherit"
  },
  active: {
    fontWeight: "700!important",
    fontSize: "20px!important",
    lineHeight: "24px!important",
    textAlign: "left",
    color: "#1E3A3A"
  },
  childText: {
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "19px",
    textAlign: "left",
    padding: "8px 0px"
  },
}));

const ProductListBody = () => {
  const classes = useStyles();
  const [openFilter, setOpenFilter] = React.useState(false);
  const character = usePageData((data) => data.character);
  const [filter, setFilter] = React.useState({
    gender: `${character?.if_boy ? "1" : "0"},${
      character?.if_girl ? "1" : "0"
    }`,
    price: "4,60",
    sortby: "price:asc",
  });
  const [model, setModel] = useModel();
  const api = useApi();
  const [runApi] = useAsyncTask("get-character-model");

  useEffect(() => {
    runApi(async () => {
      const res = await api
        .path("public/character/product_list", { character_id: character?.id }, filter)
        .get();
      setModel(res?.data?.result?.models);
    });
  }, [filter]);

  return (
    <Grid container>
      <Hidden smDown>
        <FilterProductTab filter={filter} setFilter={setFilter} />
      </Hidden>
      <Hidden mdUp>
        <Grid xs={12} item>
          <Box className={classes.root}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              onClick={() => {
                setOpenFilter(true);
              }}
            >
              <Typography className={classes.amountFilter}>
                {
                  Object.keys(filter)?.filter((e) => {
                    if (filter[e] && e !== "producttypeid") {
                      return e;
                    }
                  })?.length
                }
              </Typography>
              <Typography className={classes.titleFilter}>
                &nbsp;&nbsp;FILTER & SORT&nbsp;&nbsp;
              </Typography>
              <IconComponent name="filterSortIcon" />
            </Box>
          </Box>
        </Grid>
        <DrawerRight
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          filter={filter}
          setFilter={setFilter}
        />
      </Hidden>
      <ProductList filter={filter} setFilter={setFilter} products={model && model.products}/>
    </Grid>
  );
};

export default ProductListBody;
