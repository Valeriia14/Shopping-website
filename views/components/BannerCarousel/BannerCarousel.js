import { IconComponent } from "@ktwebsite/components";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Slider from "react-slick";

const NextArrow = (props) => {
  const { className, style, onClick } = props;

  return (
    <div className={className} style={{ ...style }} onClick={onClick}>
      <IconComponent name="arrowRightIcon" />
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;

  return (
    <div className={className} style={{ ...style }} onClick={onClick}>
      <IconComponent name="arrowLeftIcon" />
    </div>
  );
};

var settings = {
  dots: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  infinite: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  autoplay: true,
  autoplaySpeed: 3000,
};

const useStyles = makeStyles((theme) => ({
  root: {},
  sliderContainer: {
    "& .slick-arrow": {
      "&.slick-next": {
        [theme.breakpoints.up("lg")]: {
          right: 250,
        },
        [theme.breakpoints.down("md")]: {
          right: 16,
        },
      },
      "&.slick-prev": {
        [theme.breakpoints.up("lg")]: {
          left: 250,
        },
        [theme.breakpoints.down("md")]: {
          left: 16,
        },
        zIndex: 1,
      },
      "&::before": {
        content: "none",
      },
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.up("sm")]: {
      display: "inherit",
      "& .slick-dots": {
        display: "none!important",
      },
    },
  },
  sliderContainerMobile: {
    "& .slick-arrow": {
      "&.slick-next": {
        right: 16,
      },
      "&.slick-prev": {
        left: 16,
        zIndex: 1,
      },
      "&::before": {
        content: "none",
      },
    },
    [theme.breakpoints.down("sm")]: {
      display: "inherit",
      "& .slick-dots": {
        bottom: "32px!important",
      },
    },
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  bannerCarouselCardContainer: {
    height: "auto",
    background: "#F3F6F8",
    position: "relative",
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  bannerCarouselCardImage: {
    width: "100%",
  },
  titleBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)"
  },
  header : {
    fontSize: "54px",
    fontWeight: 400,
    lineHeight: "70px",
    textAlign: "left",
    color: "#1e3a3a",
    [theme.breakpoints.down("sm")]:{
      fontSize: "20px",
      fontWeight: 400,
      lineHeight: "28px",
      textAlign: "left"
    }
  },
  subheader: {
    fontSize: "20px",
    fontWeight: 400,
    lineHeight: "28px",
    textAlign: "center",
    color: "#1e3a3a",
    [theme.breakpoints.down("sm")]:{
      fontSize: "12px",
      fontWeight: 500,
      lineHeight: "28px",
      textAlign: "left"
    }
  }
}));

const BannerCarousel = (props) => {
  const classes = useStyles();
  const { element } = props;
  const items = element ?? [];

  return (
    <Box className={classes.root}>
      <Slider
        {...settings}
        className={classes.sliderContainer + " banner_carousel"}
      >
        {items?.map((p, key) => (
          <Box
            // component="a"
            key={`banner-carousel-slick-item-desk-${key}`}
            // href={p.url}
          >
            <Box className={classes.bannerCarouselCardContainer}>
              <img
                className={classes.bannerCarouselCardImage}
                src={p.img_desk || "/images/placeholder.png"}
              />
              <Box className={classes.titleBox}>
                <Typography className={classes.header}>{p.header}</Typography>
                <Typography className={classes.subheader}>{p.subheader}</Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>

      <Slider
        {...settings}
        className={classes.sliderContainerMobile + " banner_carousel"}
      >
        {items?.map((p, key) => (
          <Box
            // component="a"
            key={`banner-carousel-slick-item-mob-${key}`}
            // href={p.url}
          >
            <Box className={classes.bannerCarouselCardContainer}>
              <img
                className={classes.bannerCarouselCardImage}
                src={p.img_mob || "/images/placeholder.png"}
              />
              <Box className={classes.titleBox}>
                <Typography className={classes.header}>{p.header}</Typography>
                <Typography className={classes.subheader}>{p.subheader}</Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default BannerCarousel;
