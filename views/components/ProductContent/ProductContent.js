import React, { useEffect, useMemo, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { usePageData, usePageElements } from "@ktwebsite/hooks";
import { Box, Button, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  wrapper: {
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
  headImageWrap:{
    width: "100%",
    borderWidth: "2px",
  },
  headImage:{
    width: "100%",
    height: "100%",
    objectFit: "scaleDown",
    border: "1px solid"
  },
  heading: {
    fontSize: "20px",
    lineHeight: "29px",
    fontWeight: "normal",
    marginBottom: "22px",
  },
  paragraph: {
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0.444444px",
    maxWidth: "800px",
    margin: "auto",
  },
  contentSpacer: {
    margin: "0px 0px 60px",
    [theme.breakpoints.down("sm")]: {
      margin: "0px 0px 45px",
    },
  },
  contentImageItem: {
    display: "flex",
    width: "50%",
    padding: "10px",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  contentImagesWrap: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  contentImage:{
    objectFit: "scaleDown",
    width: "100%",
    display: "flex"
  },
  contentDescription:{
    display: "flex",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0.444444px",
    maxWidth: "800px",
    margin: "auto",
  }
}));

const ProductContent = (props) => {
  const classes = useStyles({});
  const category = usePageData((data) => data.category);
  const items = useMemo(()=>{
    return category?.webpage?.items
  }, [ category ])
  const productContent = useMemo(()=>{
    return items?.find((item)=>{
      return item.type === 'product-content'
    })
  }, [ items ])

  const { assets, options } = useMemo(()=>{
    return productContent || {}
  }, [ productContent ])
  const getImageUri = useCallback((id)=>{
    if(!id)
      return "/images/placeholder.png"
    const tmp = assets?.find((item)=>{
      return item.id === id
    })  
    if(tmp)
      return tmp.uri
    else
      return "/images/placeholder.png"
  }, [ assets ])

  const featuredImage = useMemo(()=>{
    if(!options?.feature_banner)
      return "/images/placeholder.png"
    return getImageUri(options?.feature_banner)
  }, [ options, getImageUri])

  return (
    <Box className={classes.wrapper} >
      <Grid 
      container
      direction="row"
      justifyContent="center"
      alignItems="center">
        <Grid item md={4} xs={8}>
          <Box className={classes.contentSpacer}>
            <Typography align="center" className={classes.heading}>
              {options?.product_feature}
            </Typography>
            <Typography align="center" className={classes.paragraph}>
              {options?.description}
            </Typography>
          </Box>
          <Box className={classes.headImageWrap}>
            <img 
              alt="featured-image"
              src={featuredImage} 
              className={classes.headImage}/>
          </Box>
          <Box className={classes.contentImagesWrap}>
          {
            options?.images?.map((image, key)=>{
              return(
                <Box className={classes.contentImageItem} key={`content-image-${key}`}>
                  <img src={getImageUri(image.asset)} className={classes.contentImage}></img>
                  <Typography align="center" className={classes.contentDescription}>
                    {image?.title}
                  </Typography>
                </Box>
              )
            })
          }
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductContent;
