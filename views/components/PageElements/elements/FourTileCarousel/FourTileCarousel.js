import { Box, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowLeftSharpIcon from '@material-ui/icons/ArrowLeftSharp';
import ArrowRightSharpIcon from '@material-ui/icons/ArrowRight';
import React, { useMemo } from "react";
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
  dots: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 2,
  infinite: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [{
    breakpoint: 600,
    settings: {
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true
    }
  }],
};

const useStyles = makeStyles((theme) => ({
  root: {

  },
  cardContainer: {
    borderRadius: 10,
    background: "#F3F6F8",
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  cardImage: {
    width: "100%",
    borderRadius: 10,
  },
}));

const FourTileCarousel = (props) => {
  const classes = useStyles();
  const { element } = props;
  const items = element?.options ?? [];

  settings.infinite = items?.length > 4 // react-slick has issue with infinite scroll

  return (
    <Box className={classes.root}>
      <Container disableGutters maxWidth="md">
        <Slider {...settings} className="four_tile_carousel">
          {
            items.map((p, key) => (
              <Box component="a" key={`four-tile-carousel-slick-item-${key}`} href={p.url}>
                <Box className={classes.cardContainer}>
                  <img className={classes.cardImage} src={p.image}/>
                </Box>
              </Box>
            ))
          }
        </Slider>

      </Container>
    </Box>

  )
}

export default FourTileCarousel;
