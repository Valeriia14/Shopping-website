import { Box, Grid, Hidden } from "@material-ui/core";
import React, { Fragment, useState } from "react";
import Slider from "react-slick";
import { usePageData } from "@ktwebsite/hooks";
import { useStyles } from "./styles";
import ProductItemBox from "../ProductItemBox";

const ProductListing = () => {
  const classes = useStyles();
  const data = usePageData();
  const { products_weekly_best } = data;
  const widthDevice = typeof window !== "undefined" ? window.innerWidth : 0;
  const [swipping, setSwipping] = useState(false);

  const getInitialSlides = () => {
    if (widthDevice < 1200 && widthDevice >= 600) {
      return 1;
    } else if (widthDevice < 600) {
      return 0;
    } else {
      return 2;
    }
  };

  const settings = {
    dots: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    initialSlide: getInitialSlides(),
    swipeToSlide: true,
    autoplay: false,
    centerMode: true,
    beforeChange: () => {
      setSwipping(true);
    },
    afterChange: () => {
      setSwipping(false);
    },
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          centerMode: false,
          slidesToShow: 2,
          variableWidth: true,
        },
      },
    ],
  };

  return (
    <Box className={classes.root}>
      <Hidden xsDown>
        {products_weekly_best.length >= 4 && (
          <Slider className={classes.slick} {...settings}>
            {products_weekly_best?.map((item, index) => {
              return (
                <Fragment key={index}>
                  <ProductItemBox
                    item={item}
                    index={index}
                    swipping={swipping}
                    classes={classes}
                  />
                </Fragment>
              );
            })}
          </Slider>
        )}
        {products_weekly_best.length < 4 && (
          <Grid container>
            {products_weekly_best?.map((item, index) => {
              return (
                <Grid item xs={6} md={4} lg={3} key={index}>
                  <ProductItemBox
                    item={item}
                    index={index}
                    swipping={swipping}
                    classes={classes}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Hidden>
      <Hidden smUp>
        {products_weekly_best.length >= 2 && (
          <Slider className={classes.slick} {...settings}>
            {products_weekly_best?.map((item, index) => {
              return (
                <Fragment key={index}>
                  <ProductItemBox
                    item={item}
                    index={index}
                    swipping={swipping}
                    classes={classes}
                  />
                </Fragment>
              );
            })}
          </Slider>
        )}
        {products_weekly_best.length < 2 && (
          <Grid container>
            {products_weekly_best?.map((item, index) => {
              return (
                <Grid item xs={6} md={4} lg={3} key={index}>
                  <ProductItemBox
                    item={item}
                    index={index}
                    swipping={swipping}
                    classes={classes}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Hidden>
    </Box>
  );
};

export default ProductListing;
