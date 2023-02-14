import { Box, Typography, Container, Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import React, { useMemo, useCallback } from "react";
import { usePageData, usePageElements } from "@ktwebsite/hooks";

import ArrowLeftSharpIcon from "@material-ui/icons/ArrowLeftSharp";
import ArrowRightSharpIcon from "@material-ui/icons/ArrowRight";
import Slider from "react-slick";

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
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  centerMode: true,
  infinite: true,
  dots: true,

  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [{
    breakpoint: 960,
    settings: {
      slidesToShow: 3,
    }
  }, {
    breakpoint: 600,
    settings: {
      arrows: false,
      dots: false,
      slidesToShow: 2,
    }
  }, {
    breakpoint: 400,
    settings: {
      arrows: false,
      dots: false,
      slidesToShow: 1,
    }
  }],
};

const useStyles = makeStyles((theme) => ({
  bannerImage: {
    borderRadius: "10px",
    boxShadow: "0 0px 20px rgb(0 0 0 / 20%)",
    width: "100%",
    maxHeight: "300px",
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
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(0, 1),
    },
  },
  cardImage: {
    width: "100%",
    borderRadius: 10,
  },
  cardBtn: {
    width: "130px",
    bottom: "15%",
    position: "absolute",
    background: "white",
    boxShadow: "0 0px 20px rgb(0 0 0 / 30%)",
    fontSize: "12px",

  },
  headerText: {
    width: "100%",
    textAlign: "left",
    color: "#2D2866",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "20px",
    lineHeight: "22px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "16px",
      lineHeight: "18px",
      paddingLeft: "20px"
    },
  },
  subheaderText: {
    width: "100%",
    textAlign: "left",
    color: "#2D2866",
    textDecoration: "none",
    fontWeight: "regular",
    fontSize: "17px",
    lineHeight: "22px",
    marginBottom: "45px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "15px",
      lineHeight: "18px",
      paddingLeft: "20px"
    },
  },


  cartProductWrap: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: theme.spacing(8),
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginLeft: "0px",
    },
  },
  contents: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexWrap: 'wrap',
    },
  },
  feature: {
    [theme.breakpoints.down('xs')]: {
      marginBottom: '40px',
    },
  },
  bannerBox:{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  slider: {
    textAlign: 'center',
    width: '50%',
    marginLeft: '45px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginLeft: 'unset',
    },
  },
}));


const FeatureCarousel = (props) =>{
  const classes = useStyles({})
  const { element } = props;
  const { feature_banner, header, subheader, images } = element?.options;

  settings.infinite = images?.length > 3 // react-slick has issue with infinite scroll
  settings.dots = images?.length > 3 // react-slick has issue with infinite scroll
  settings.centerMode = images?.length > 3 // react-slick has issue with infinite scroll

  const emptyContainerTotal = images.length <= 3 ? new Array(3 - images.length).fill({}) : [];

  return (
    <Box className={classes.cartProductWrap} >
      <Container disableGutters maxWidth="lg">
        <Box className={classes.contents}>
          <Box className={classes.feature}>
            <Box className={classes.bannerBox}>
              <img src={ feature_banner ?? "/images/placeholder.png"} className={classes.bannerImage} />
            </Box>
          </Box>
          <Box className={classes.slider}>
            <Typography className={classes.headerText}>{header}</Typography>
            <Typography className={classes.subheaderText}>{subheader}</Typography>
            <Slider
                {...settings}
                className="slick_featured_slider"
              >
                {
                  images?.map((p, key) => (
                    <Box key={`feature-carousel-slick-item-${key}`}>
                      <Box className={classes.cardContainer}>
                        <img className={classes.cardImage} src={p.asset}/>
                        <Button className={classes.cardBtn} href={p.url} variant="contained">{p.title}</Button>
                      </Box>
                    </Box>
                  ))
                }
                {
                  emptyContainerTotal.map((p, key) => (
                    <Box key={`feature-carousel-slick-item-empty-${key}`}>
                    </Box>
                  ))
                }
              </Slider>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default FeatureCarousel;
