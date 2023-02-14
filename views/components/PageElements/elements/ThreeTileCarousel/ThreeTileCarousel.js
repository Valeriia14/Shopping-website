import { Box, Container, Typography, Button } from "@material-ui/core";
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
  slidesToShow: 3,
  slidesToScroll: 1,
  infinite: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [{
    breakpoint: 600,
    settings: {
      arrows: false,
      slidesToShow: 1,
      centerMode: true
    }
  }],
};

const useStyles = makeStyles((theme) => ({
  root: {

  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
    borderRadius: 10,
    background: "#F3F6F8",
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  title: {
    fontWeight: "normal",
    fontSize: "25px",
    lineHeight: "20px",
    letterSpacing: "0.15px",
    fontSize: "25px",
  },
  description: {
    fontWeight: "normal",
    lineHeight: "20px",
    letterSpacing: "0.15px",
    margin: "0 auto",
    marginTop: "10px",
    fontSize: "15px",
  },
  cardImage: {
    width: "100%",
    borderRadius: 10,
    filter: "brightness(80%)",
    opacity: "0.7",
  },
  detailContainer: {
    position: "absolute",
    color: "white",
    textAlign: "center",
    width: "250px",
  },
  cardBtn: {
    width: "155px",
    bottom: "20%",
    position: "absolute",
    background: "white",
    opacity: 0,
  }
}));

const ThreeTileCarousel = (props) => {
  const classes = useStyles();
  const { element } = props;
  const items = element?.options ?? [];
  const emptyContainerTotal = items.length <= 4 ? new Array(4 - items.length).fill({}) : [];

  return (
    <Box className={classes.root}>
      <Container disableGutters maxWidth="md">
        <Slider {...settings} className="three_tile_carousel">
          {
            items.map((p, key) => (
              <Box key={`three-tile-carousel-slick-item-${key}`}>
                <Box className={classes.cardContainer}>
                  <img className={classes.cardImage} src={p.image}/>
                  <div className={classes.detailContainer}>
                    <Typography className={classes.title}>{p.header}</Typography>
                    <Typography className={classes.description}>{p.subheader}</Typography>
                  </div>
                  <Button className={classes.cardBtn} href={p.url} variant="contained">{p.cta}</Button>
                </Box>
              </Box>
            ))
          }
          {
            emptyContainerTotal.map((p, key) => (
              <Box key={`three-tile-carousel-slick-item-empty-${key}`}>
              </Box>
            ))
          }

        </Slider>

      </Container>
    </Box>

  )
}

export default ThreeTileCarousel;
