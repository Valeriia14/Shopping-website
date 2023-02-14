import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box, Button, InputBase, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { usePageData, usePageElements } from "@ktwebsite/hooks";
import { Paper, Tab, Tabs } from "@material-ui/core";
import { ProductListing } from "@ktwebsite/components";

const useStyles = makeStyles((theme) => ({
  cartProductWrap: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginLeft: "0px",
    },
  },
  filterTab:{
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  subfilterTab:{
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  panel:{
    width: "100%"
  },
  filterBtnInactive:{
    borderRadius: "20px",
    height: "40px",
    color: theme.palette.primary.dark,
    background: 'white',
    margin: "10px"
  },
  filterBtnActive:{
    borderRadius: "20px",
    height: "40px",
    backgroundColor: theme.palette.primary.dark,
    color: 'white',
    margin: "10px"
  },
  filterProductList:{
    width: "100%"
  }
}));

const ProductCatalogue = (props) => {
  const classes = useStyles({});
  const category = usePageData((data) => data.category);
  const filters = usePageData((data) => data.filters);
  const subfilters = usePageData((data) => data.subfilters);

  const [ activeFilter, setActiveFilter ] = useState(0)
  const [activeSubFilter, setActiveSubFilter ] = useState(0)
  
  const subTitles = useMemo(()=>{
    const handle = filters[activeFilter]?.child?.handle
    return subfilters[handle]
  }, [subfilters, activeFilter, filters])

  const activeProducts = useMemo(()=>{
    let tmp = []
    subTitles?.map((item)=>{
      let prods = []
      item.child?.category_has_products?.map((each)=>{
        prods.push(each.product)
      })
      tmp.push(prods)
    })
    return tmp
  }, [subTitles])

  const activeFilterProducts = useMemo(()=>{
    const filter = filters[activeFilter]?.child
    if(!filter) return []
    let prods = []
    filter.category_has_products?.map((each)=>{
      prods.push(each.product)
    })
    return prods
  }, [activeFilter])

  const renderSubFilters = useCallback(()=>{
    return(
          <>
            <Tabs
                value={activeSubFilter}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="off"
              >
                {
                  subTitles.map((each, index) =>
                    <Tab
                        key={index}
                        label={each.child?.handle}
                        onClick={() => setActiveSubFilter(index)}
                    />
                  )
                }   
            </Tabs>
            <Paper elevation={1} className={classes.panel}>
                {subTitles?.length && 
                    subTitles.map((each, index) => 
                    <div key={index} role="tabpanel" hidden={activeSubFilter !== index}>
                        <ProductListing products={activeProducts?activeProducts[index]:null} character={category}/>
                    </div>
                )}
            </Paper>
          </>
    )
      
  }, [activeSubFilter, subTitles, activeProducts])

  const renderFilterProducts = useCallback(()=>{
    return (
      <div className={classes.filterProductList}>
        <ProductListing products={activeFilterProducts?activeFilterProducts: null} character={category}/>
      </div>
    )
  }, [activeFilterProducts])

  return (
    <Box className={classes.cartProductWrap} >
        <Box className={classes.filterTab}>
            {
                filters?.map((prop, key)=>{
                    return(
                        <Button 
                        key={`filter-${key}`}
                        variant="outlined"
                        className={(key === activeFilter)? classes.filterBtnActive : classes.filterBtnInactive}
                        onClick={()=>{
                            setActiveFilter(key)
                        }}
                    >
                        {prop?.child?.handle}
                    </Button>
                    )
                })
            }
        </Box>
        <Box className={classes.subfilterTab}>
        {subTitles?.length > 0 ?
            renderSubFilters()
          : 
            renderFilterProducts()
        }
        </Box>
        
    </Box>
  );
};

export default ProductCatalogue;
