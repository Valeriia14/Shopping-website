import KTImage from "@ktwebsite/components/KTImage";
import { Box, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowLeftSharpIcon from '@material-ui/icons/ArrowLeftSharp';
import ArrowRightSharpIcon from '@material-ui/icons/ArrowRight';
import React from "react";
import Slider from 'react-slick';

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style }}
      onClick={onClick}
    >
      <ArrowRightSharpIcon fontSize="large" />
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style }}
      onClick={onClick}
    >
      <ArrowLeftSharpIcon fontSize="large" />
    </div>
  );
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  initialSlide: 0,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        dots: true
      }
    },
  ]
};

const useStyles = makeStyles((theme) => ({
  exploreCardContainer: {
    height: "auto",
    padding: 20,
    borderRadius: 10,
    background: "#F3F6F8",
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  exploreCardImage: {
    height: 155,
    width: 155,
    margin: "auto",
    padding: "20px",
    background: "#fff"
  },
  exploreItemDescription: {
    fontWeight: "normal",
    fontSize: 16,
    letterSpacing: 0.444444,
    marginTop: "10px",
  },
  exploreBtnBrowse: {
    background: "#2D2866",
    color: "#fff",
    maxWidth: 188,
    borderRadius: 10,
    padding: theme.spacing(1, 1.5),
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "auto",
    },
  },
}));

const ExploreMoreProducts = (props) => {
  const { categories = [] } = props;
  const classes = useStyles();

  const getLink = (category) => {
    if (category.type === "character")
      return `/character/${category.handle}`;
    return `/category/${category.handle}`;
  };

  return (
    <Slider {...settings} className="slick_explore_more_dots">
      {categories.map(category => (
        <Box key={category.id}>
          <Box className={classes.exploreCardContainer}>
            <KTImage className={classes.exploreCardImage} src={category.image} />
            <Typography className={classes.exploreItemDescription}>{category.description}</Typography>
            <Typography className={classes.exploreItemDescription}>{category.name}</Typography>
          </Box>
          <Button
            href={getLink(category)}
            className={classes.exploreBtnBrowse}
          >
            Browse {category.name}
          </Button>
        </Box>
      ))}
    </Slider>

  )
}

export default ExploreMoreProducts;
