import { ErrorMessage, FancyButton, ProductRow, QuantityInput, RatingStar } from "@ktwebsite/components";
import { useCart, usePageData } from "@ktwebsite/hooks";
import useApi from "@ktwebsite/utils/api/useApi";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { formatMoney, parseNumber } from "@ktwebsite/utils/strings/generators";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import { Box, ButtonBase, Divider, Grid, InputLabel, lighten, makeStyles, MenuItem, Select, Typography, Tab, Tabs } from "@material-ui/core";
import BigNumber from "bignumber.js";
import clsx from "clsx";
import { useSnackbar } from "notistack";
import React, { useEffect, useMemo, useState } from "react";
import { QATab, ReviewTab } from "./components";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{width: "100%", background: "#D8D8D8"}}>
          {children}
        </Box>
      )}
    </div>
  );
}


const ProductDetailTabView = (props) => {
  const { children, className, ...rest } = props;
  const api = useApi();
  const [cart, setCart] = useCart();
  const { enqueueSnackbar } = useSnackbar();
  const product = usePageData(data => data.product);
  
  const classes = useStyles();
  const reviews = usePageData(data=>data.reviews)
  const qas = usePageData(data=>data.qas)
  const category = usePageData(data=>data.category)
  const webpageItems = usePageData(data=>data.category?.webpage?.items)
  const featured_carousel = webpageItems?.filter((item)=>item.type==="feature-carousel")
  const [value, setValue] = React.useState(0);
  const product_description = usePageData(data=>data.product_description)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const tags = [ "New", "SALE", "FREE GIFT"]
  return (
    <Box {...rest} className={clsx(classes.root, className)}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }} id="section_description">
            <Tabs 
                // indicatorColor={"primary"}
                className={classes.tabButton}
                TabIndicatorProps={{style: {background:'ANY_COLOR'}}}
                value={value} onChange={handleChange}>
                <Tab 
                  id="tab-description"
                  className={clsx(classes.tab, (value === 0)? classes.activeTab: "")}
                  label="PRODUCT DESCRIPTION" {...a11yProps(0)} />
                <Tab 
                  id="tab-review"
                  className={clsx(classes.tab, (value === 1)? classes.activeTab: "")}
                  label={`REVIEW(${reviews.length || 0})`} {...a11yProps(1)} />
                <Tab
                  id="tab-qa"
                  className={clsx(classes.tab, (value === 2)? classes.activeTab: "")}
                  label={`Q&A(${qas.length || 0})`} {...a11yProps(2)} />
              </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Box className={classes.panelContainer} 
                      flexDirection="column" alignItems="center"
                      justifyContent="center">
                        {!product_description?.length ? "":product_description.map((item, index) =>{
                          return (
                            <Box key={index}><img src={item?.uri ? item?.uri : "/images/Pic_main1.svg"}></img></Box>
                          )
                        })}
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ReviewTab/>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <QATab/> 
          </TabPanel>
        </Box>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  panelContainer: {
    background: "white",
    height: 1900,
    padding: "93px 216px 93px 216px",
    overflow: 'auto',
    '&::-webkit-scrollbar': {
        width: 10,
        [theme.breakpoints.down('md')]:{
            width: 5, 
        }
    },          
    '&::-webkit-scrollbar-thumb': {
        background: '#666',
        borderRadius: 9,
        [theme.breakpoints.down('md')]:{
            borderRadius: 2.5, 
        }
    },          
    '&::-webkit-scrollbar-track': {
        background: '#ddd',
        borderRadius: 9
    },          
    '& div':{
      paddingBottom: 20,
  },
  '& img':{
      width: 840,
      [theme.breakpoints.down('md')]:{
          width: 'calc(100vw - 100px)', 
      }
  },
  '& .MuiTabPanel-root':{
      paddingTop: 'unset'
  },
    [theme.breakpoints.down("sm")]:{
      height: 640,
      padding: "50px 23px 50px 23px",
    }
  },
  
  descImgContainer: {
    height: "1064px",
    width: "100%",
    marginBottom: "30px",
    background: "#999999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "contain"
    },
    [theme.breakpoints.down("sm")]:{
      height: "364px",
    }
  },
  placeHolder:{
    width: "88px",
    height: "88px"
  },
  tabs:{
    background: "red"
  },
  tab:{
    background: "#D8D8D8",
    border: "solid 1px #979797",
    color: "#333333",
    fontSize: "18px",
    padding: "22px 48px 22px 48px",
    [ theme.breakpoints.down("sm") ]: {
      padding: "22px 9px 22px 9px",
      fontSize: "14px",
      width: "25%"
    }
  },
  activeTab:{
    borderBottom: "none",
  },
  root: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    paddingTop: '170px',
    [theme.breakpoints.down("sm")]: {
      paddingTop: '50px',
      paddingLeft: 0,
    },
  },
  title: {
    marginTop: "10px",
    fontWeight: 400,
    fontSize: "30px",
    color: "#333333",
    marginBottom: "4px"
  },
  rating: {
    fontSize: theme.spacing(3),
    justifyContent: "flex-start",
  },
  btnCheckout: {
    backgroundColor: theme.palette.primary.dark,
    "&:hover": {
      backgroundColor: lighten(theme.palette.primary.dark, .1),
    },
  },
  btnAddToCart: {
    backgroundColor: "#1cb372",
    "&:hover": {
      backgroundColor: lighten("#1cb372", .1),
    },
  },
  selectContainer: {
    flex: 1,
    display: "flex",
  },
  select: {
    alignItems: "center",
  }, 
  imageContainer: {
    width: 70,
    height: 70,
    padding: 5,
    borderRadius: theme.spacing(1),
    marginRight: theme.spacing(3),
    boxShadow: "0 2px 10px rgba(0,0,0,.2)"
  },
  image: {
    width: "100%",
    height: "auto"
  },
  selectItem: {
    height: "80px",
  },
  selectMenu: {
    display: "flex!important"
  },
  nativeInput: {
    display: "none"
  },
  discountedValue: {
    color: "rgba(0,0,0, 0.5)",
    fontSize: "13px",
    lineHeight: "20px"
  },
  tabButton:{
    '& .MuiTabs-flexContainer':{
        borderBottom: '1px solid black',
    },
    '& .MuiButtonBase-root': {
        padding: '20px 40px',
        fontSize: '18px',
        fontStyle: 'normal',
        fontWeight: 800,
        background: '#FAF8F3',
        fontFamily: 'Barlow',
        opacity: 1,
        border: '1px solid #E3E3E3',
        borderBottom: '1px solid black',
        '&.Mui-selected':{
            background: 'white',
            borderLeft: '1px solid #000000',
            borderRight: '1px solid #000000',
            borderTop: '1px solid #000000',
            borderBottom: '1px solid white',
            outline: 'none',
        },
        marginBottom: '-1px',
        [theme.breakpoints.down('md')]:{
            width: 100,
            fontSize: 12,
        }
    },
    '& .MuiTabs-indicator': {
        display: 'none'
    },
  }
}));

export default ProductDetailTabView;
