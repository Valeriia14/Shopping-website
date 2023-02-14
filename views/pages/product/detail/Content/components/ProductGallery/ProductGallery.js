import { usePageData } from "@ktwebsite/hooks";
import { Box, Grid, Icon, makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import React, { useEffect, useState, useMemo } from "react";
import Slider from "react-slick";
import HeartIcon from "@material-ui/icons/FavoriteBorderOutlined";
import { BorderBottom } from "@material-ui/icons";
import {
  EmailShareButton,
  FacebookShareButton,
  InstapaperShareButton,
  TwitterShareButton,
  PinterestShareButton,
} from "react-share";

const ProductGallery = (props) => {
  const { children, className, ...rest } = props;
  const product = usePageData((data) => data.product);
  const category = usePageData((data) => data.category);
  const images = usePageData((data) => data.product_images);
  const classes = useStyles();

  const attribute_images = useMemo(() => {
    const attributes = category?.webpage?.items?.find((item) => {
      return item.type === "media-attributes";
    });
    if (!category || !attributes) return [];
    return attributes.assets;
  }, [category]);
  const all_images = useMemo(() => {
    let result = product?.preview
      ? [product?.preview, ...attribute_images, ...images]
      : [...attribute_images, ...images];
    return result;
  }, [attribute_images, images]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (all_images.length && !selectedImage) setSelectedImage(all_images[0]);
  }, [all_images]);

  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      <Box className={clsx(classes.imageSquare, classes.previewBox)}>
        <Box className={classes.like}>
          <HeartIcon />
        </Box>
        <img src={selectedImage?.uri ?? "/images/placeholder.png"} />
      </Box>
      <Grid container className={classes.galleryContainer}> 
        {all_images?.map((image, key) => {
                console.log(key)
                if(key < 4)return (
                  <Box  className={clsx(classes.galleryItem)} key={image.id} onClick={() => setSelectedImage(image)}>
                    <img src={image.uri} className={clsx(classes.itemImage, image === selectedImage ? classes.highlightBorder: '')}/>
                  </Box>
                )
              })}
      </Grid>
      {/* <Grid container className={classes.galleryContainer}>
        <Grid
          item
          xs={3}
          md={3}
          className={clsx(classes.galleryItem)}
          onClick={() => setSelectedImage(image)}
          key={key}
        >
          <img
            src={image.uri} className={clsx(classes.itemImage, image === selectedImage ? classes.highlightBorder: '')}
          />
        </Grid>
      </Grid> */}
      <Box className={classes.shareWrap}>
        <Typography className={classes.shareText}>SHARE THIS LINK</Typography>
        <Box className={classes.iconGroup}>
          <EmailShareButton
            subject={"Awesome product on Kidztime"}
            body={`${product.name}\n`}
            url={`https://staging.kidztime.com/products/${product.handle}`}
            separator=""
          >
            <img src="/images/Mail_icon.svg"></img>
          </EmailShareButton>
          <FacebookShareButton
            url={`https://staging.kidztime.com/products/${product.handle}`}
          >
            <img src="/images/FaceBook_icon.svg"></img>
          </FacebookShareButton>
          <InstapaperShareButton
            url={`https://staging.kidztime.com/products/${product.handle}`}
          >
            <img src="/images/Instagram_icon.svg"></img>
          </InstapaperShareButton>
          <TwitterShareButton
            url={`https://staging.kidztime.com/products/${product.handle}`}
          >
            <img src="/images/Twitter_icon.svg"></img>
          </TwitterShareButton>
          <PinterestShareButton
            url={`https://staging.kidztime.com/products/${product.handle}`}
          >
            <img src="/images/Pinterest_icon.svg"></img>
          </PinterestShareButton>
        </Box>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  iconGroup: {
    marginLeft: "10px",
    display: "flex",
    width: "170px",
    justifyContent: "space-between",
    border: "1px solid #000000",
    borderRadius: "16.5px",
    padding: "8px 15px",
    "& button": {
      width: "16px",
      height: "16px",
    },
  },
  shareText: {
    flex: 1,
    fontSize: "14px",
    lineHeight: "17px",
    color: "#333333",
  },
  shareWrap: {
    alignItems: "center",
    flexDirection: "row",
    display: "flex",
    // justifyContent:"space-between",
    // border: "solid 1px #333333",
    // borderLeft: "none",
    // borderRight: "none",
    margin: "1px",
    marginTop: "115px",
    // width: "100%",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: "110px 110px 192px 0px",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      marginBottom: theme.spacing(3),
      height: "540px",
      paddingRight: "0px",
    },
    height: "940px",
  },
  like: {
    display: "flex",
    zIndex: 100,
    top: "22px",
    right: "22px",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "30px",
    height: "30px",
    borderRadius: "15px",
    background: "transparent",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      height: "43px",
      width: "43px",
      borderRadius: "22px",
    },
    "&:hover": {
      // background: "gray",
      "& svg": {
        color: "white",
      },
    },
    "& svg": {
      [theme.breakpoints.down("sm")]: {
        width: "25px",
        height: "25px",
      },
      width: "40px",
      height: "40px",
      color: "black",
    },
  },
  previewBox: {
    [theme.breakpoints.down("sm")]: {
      height: "420px",
      minHeight: "420px",
    },
    height: "700px",
  },
  mobileGallery: {
    margin: theme.spacing(0, -2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
    "& .slick-dots": {
      "& li button:before": {
        fontSize: theme.spacing(5),
      },
    },
  },
  mobileGalleryItem: {
    "& img": {
      width: "100%",
    },
  },
  galleryContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: "30px",
    maxWidth: "100%",
    paddingTop: 10,
    position: "relative",
    background: "white",
    [theme.breakpoints.down("sm")]: {
      height: "100px",
    },
  },
  imageSquare: {
    width: "100%",
    height: "100%",
    flex: 1,
    position: "relative",
    background: "#D8D8D8",
    overflow: "hidden",
    borderRadius: 0,
    boxShadow: "0 2px 0px rgba(0,0,0,.2)",
    "& img": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "contain",
      background: "#D8D8D8",
    },
  },
  imageHighlight: {
    height: "120px",
    width: "120px",
    borderRadius: theme.spacing(1),
    border: "4px solid #2d2866",
  },
  highlightBorder: {
    borderRadius: theme.spacing(1),
    border: "4px solid #2d2866!important",
  },
  galleryItem: {
    position: "relative",
    display: "flex",
    cursor: "pointer",
    height: "120px",
    width: "120px",
    [theme.breakpoints.down("sm")]: {
      width: "77px!important",
      height: "77px!important",
    },
    background: "white",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
}));

export default ProductGallery;
