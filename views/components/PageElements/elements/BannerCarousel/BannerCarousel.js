import { Box, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowLeftSharpIcon from '@material-ui/icons/ArrowLeftSharp';
import ArrowRightSharpIcon from '@material-ui/icons/ArrowRight';
import React from "react";
import Slider from 'react-slick';

const NextArrow = (props)=> {
  const { slideCount, currentSlide, ...rest } = props;
  return (
    <div {...rest}>
      <ArrowRightSharpIcon fontSize="large" />
    </div>
  );
}

const PrevArrow = (props)=> {
  const { slideCount, currentSlide, ...rest } = props;
  return (
    <div {...rest}>
      <ArrowLeftSharpIcon fontSize="large" />
    </div>
  );
}

const settings = {
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
  root: {

  },
  sliderContainer: {
    [theme.breakpoints.down('sm')]: {
      display: "none",
    },
    [theme.breakpoints.up('sm')]: {
      display: "inherit",
    },
  },
  sliderContainerMobile: {
    [theme.breakpoints.down('sm')]: {
      display: "inherit",
    },
    [theme.breakpoints.up('sm')]: {
      display: "none",
    },
  },
  bannerCarouselCardContainer: {
    height: "auto",
    background: "#F3F6F8",
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  bannerCarouselCardImage: {
    width: "100%",
  },

}));

const BannerCarousel = (props) => {
  const classes = useStyles();
  const { element } = props;
  const items = element?.options ?? [];

  return (
    <Box className={classes.root}>
      <Container disableGutters maxWidth="lg">
        <Slider {...settings}  className={classes.sliderContainer + ' banner_carousel'}>
          {
            items.map((p, key) => (
              <Box component="a" key={`banner-carousel-slick-item-desk-${key}`} href={p.url}>
                <Box className={classes.bannerCarouselCardContainer}>
                  <img className={classes.bannerCarouselCardImage} src={p.img_desk}/>
                </Box>
              </Box>
            ))
          }
        </Slider>

        <Slider {...settings}  className={classes.sliderContainerMobile + ' banner_carousel'}>
          {
            items.map((p, key) => (
              <Box component="a" key={`banner-carousel-slick-item-mob-${key}`}  href={p.url}>
                <Box className={classes.bannerCarouselCardContainer}>
                  <img className={classes.bannerCarouselCardImage} src={p.img_mob}/>
                </Box>
              </Box>
            ))
          }
        </Slider>

      </Container>
    </Box>

  )
}

export default BannerCarousel;
