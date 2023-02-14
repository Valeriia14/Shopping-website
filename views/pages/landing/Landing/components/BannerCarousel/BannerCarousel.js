import { IconComponent } from "@ktwebsite/components";
import { Box, Button, Typography } from "@material-ui/core";
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
  dots: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  infinite: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  // autoplay: true,
  autoplaySpeed: 3000,
};

const useStyles = makeStyles((theme) => ({
  root: {},
  sliderContainer: {
    "& .slick-arrow": {
      "&.slick-next": {
        [theme.breakpoints.up("lg")]: {
          right: 51,
        },
        [theme.breakpoints.down("md")]: {
          right: 16,
        },
      },
      "&.slick-prev": {
        [theme.breakpoints.up("lg")]: {
          left: 51,
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
  },
  bannerCarouselCardImage: {
    width: "100%",
  },
  titleBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    [theme.breakpoints.down("xs")]: {
      top: 0,
      transform: "translate(-50%)",
    },
  },
  header: {
    fontSize: "54px",
    fontWeight: 700,
    lineHeight: "70px",
    textAlign: "center",
    color: "#1e3a3a",
    fontFamily: "Cormorant-SemiBold",
    marginTop: 27,
    [theme.breakpoints.down("md")]: {
      fontSize: "40px",
      fontWeight: 400,
      lineHeight: "44px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "26px",
      fontWeight: 600,
      lineHeight: "28px",
      marginTop: 16,
    },
  },
  header2: {
    fontSize: "54px",
    fontWeight: 600,
    lineHeight: "70px",
    textAlign: "center",
    color: "#1e3a3a",
    fontFamily: "Cormorant-SemiBold",
    [theme.breakpoints.down("md")]: {
      fontSize: "40px",
      fontWeight: 400,
      lineHeight: "44px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "26px",
      fontWeight: 600,
      lineHeight: "28px",
    },
  },
  subheader: {
    fontSize: "20px",
    fontWeight: 500,
    lineHeight: "28px",
    textAlign: "center",
    marginTop: 21,
    width: 440,
    [theme.breakpoints.down("sm")]: {
      width: "400px",
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: "18px",
      textAlign: "center",
      marginTop: 8,
      padding: "0px 80px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100vw",
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: "18px",
      textAlign: "center",
      marginTop: 8,
      padding: "0px 50px",
    },
  },
  button: {
    color: "white",
    padding: "13px 31px",
    backgroundColor: "#1e3a3a",
    borderRadius: "0",
    marginTop: "16px",
    "&:hover": {
      backgroundColor: "#1e3a3a",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "7px 31px",
    },
  },
  icon: {
    [theme.breakpoints.down("sm")]: {
      width: 48,
    },
    [theme.breakpoints.down("xs")]: {
      width: 48,
      marginTop: 26,
    },
  },
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
        {[
          { img_desk: "/images/Masthead.svg" },
          { img_desk: "/images/Masthead.svg" },
        ]?.map((p, key) => (
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
                <img
                  src="/images/Gift_illustration.svg"
                  className={classes.icon}
                />
                <Typography className={classes.header}>
                  Giftbox Giveaway
                </Typography>
                <Typography className={classes.header2}>
                  Share this to win
                </Typography>
                <Typography className={classes.subheader}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et
                </Typography>
                <Button className={classes.button}>SHARE THIS LINK</Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>

      <Slider
        {...settings}
        className={classes.sliderContainerMobile + " banner_carousel"}
      >
        {[
          { img_mob: "/images/Masthead_mobile.svg" },
          { img_mob: "/images/Masthead_mobile.svg" },
        ]?.map((p, key) => (
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
                <img
                  src="/images/Gift_illustration.svg"
                  className={classes.icon}
                />
                <Typography className={classes.header}>
                  Giftbox Giveaway
                </Typography>
                <Typography className={classes.header2}>
                  Share this to win
                </Typography>
                <Typography className={classes.subheader}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing ut labore
                  et
                </Typography>
                <Button className={classes.button}>SHARE THIS LINK</Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default BannerCarousel;
