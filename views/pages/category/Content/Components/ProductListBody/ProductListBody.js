import {
  Box,
  Collapse,
  Divider,
  Fade,
  Grid,
  Hidden,
  List,
  ListItem,
  ListSubheader,
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
import doRedirect from "@ktwebsite/utils/doRedirect";
import pascalize from "@ktwebsite/utils/fomatting/pascalize";

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
    textTransform: "uppercase",
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
  dropDownBox: {
    top: "35px",
    width: "100vw",
    height: "100vh",
    position: "absolute",
    background: "#8484845c",
    boxShadow: "2px 3px 8px #000000a8",
    zIndex: 3,
  },
  tabFilterBox: {
    padding: "16px",
    backgroundColor: "white",
    boxShadow: "0px 2px 6px #000000a8",
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
    position: "inherit",
  },
  active: {
    fontWeight: "700!important",
    fontSize: "20px!important",
    lineHeight: "24px!important",
    textAlign: "left",
    color: "#1E3A3A",
  },
  childText: {
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "19px",
    textAlign: "left",
    padding: "8px 0px",
  },
  img: {
    width: "fit-content!important",
    height: "fit-content!important",
    transform: "rotate(180deg)!important",
  },
}));

const ProductListBody = () => {
  const classes = useStyles();
  const [openFilter, setOpenFilter] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [filter, setFilter] = React.useState({
    gender: "1,1",
    price: "4,60",
    sortby: "price:asc",
  });
  const category = usePageData((data) => data.category);
  const [isCollapse, setIsCollapse] = React.useState({
    [category?.handle]: true,
  });
  const [tabActive, setTabActive] = React.useState(null);
  const [model, setModel] = useModel();
  const api = useApi();
  const [runApi] = useAsyncTask("get-category-model");

  useEffect(() => {
    runApi(async () => {
      const res = await api
        .path(
          "public/category/product_list",
          { category_id: category?.id },
          filter
        )
        .get();
      setModel(res?.data?.result?.models);
    });
  }, [filter]);

  useEffect(() => {
    if (openDropdown) {
      window.addEventListener("scroll", () => {
        setOpenDropdown(!openDropdown);
      });
    }
  }, [openDropdown]);

  const showContent = () => {
    return model?.categorysTab?.map((item, index) => {
      return (
        <List
          component="nav"
          key={index}
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader
              className={classes.subheaderTextLv2}
              component="div"
              id="nested-list-subheader"
              onClick={() => {
                if (item?.category !== category?.handle) {
                  doRedirect(`/category/${item?.category}`);
                } else {
                  setIsCollapse({
                    ...isCollapse,
                    [category?.handle]: !isCollapse[category?.handle],
                  });
                  if (isCollapse[category?.handle]) {
                    setFilter({ ...filter, producttypeid: null });
                    setTabActive(null);
                  }
                }
              }}
            >
              {pascalize(item?.category)}
            </ListSubheader>
          }
          // className={classes.nav}
        >
          <Collapse in={isCollapse[item?.category]}>
            {item?.productTypeTab?.map((pt, index) => {
              return (
                <ListItem
                  key={index}
                  className={classes.childText}
                  button
                  onClick={() => {
                    setFilter({ ...filter, producttypeid: pt?.id });
                    setTabActive(pt?.handle);
                    setOpenDropdown(!openDropdown);
                  }}
                >
                  <Typography
                    className={
                      filter?.producttypeid === pt?.id ? classes.active : ""
                    }
                  >
                    {pascalize(pt?.handle)}
                  </Typography>
                </ListItem>
              );
            })}
          </Collapse>
        </List>
      );
    });
  };

  return (
    <Grid container>
      <Hidden smDown>
        <FilterProductTab filter={filter} setFilter={setFilter} />
      </Hidden>
      <Hidden mdUp>
        <Grid xs={12} item>
          <Box className={classes.root}>
            <Box
              onClick={() => {
                setOpenDropdown(!openDropdown);
              }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography className={classes.titleFilter}>
                {tabActive ? pascalize(tabActive) : pascalize(category?.handle)}
                &nbsp;&nbsp;
              </Typography>
              <IconComponent
                className={openDropdown ? classes.img : null}
                name="dropdownIcon"
              />
            </Box>
            <Divider orientation="vertical" variant="middle" flexItem />
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
            <Fade in={openDropdown}>
              <Box className={classes.dropDownBox}>
                <Box className={classes.tabFilterBox}>{showContent()}</Box>
                <Box
                  onClick={() => {
                    setOpenDropdown(!openDropdown);
                  }}
                  height="100%"
                ></Box>
              </Box>
            </Fade>
          </Box>
        </Grid>
        <DrawerRight
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          filter={filter}
          setFilter={setFilter}
        />
      </Hidden>
      <ProductList filter={filter} setFilter={setFilter} products={model?.products || []}/>
    </Grid>
  );
};

export default ProductListBody;
