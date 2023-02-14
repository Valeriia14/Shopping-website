import { usePageData } from "@ktwebsite/hooks";
import { Box, Container, IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowLeftSharpIcon from "@material-ui/icons/ArrowLeftSharp";
import ArrowRightSharpIcon from "@material-ui/icons/ArrowRight";
import React, { useMemo } from "react";
import Slider from "react-slick";

function NextArrow(props) {
  const { slideCount, currentSlide, ...rest } = props;
  return (
    <div {...rest}>
      <ArrowRightSharpIcon fontSize="large" />
    </div>
  );
}

function PrevArrow(props) {
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
  slidesToShow: 1,
  slidesToScroll: 1,
  infinite: true,
  centerMode: true,
  centerPadding: "100px",
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [{
    breakpoint: 960,
    settings: {
      arrows: false,
      slidesToShow: 1,
    }
  }, {
    breakpoint: 600,
    settings: {
      arrows: false,
      slidesToShow: 1,
    }
  }],
};
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    overflow: "hidden",
  },
  cardContainer: {
    margin: theme.spacing(0, 2),
    display: "block !important",
    width: "auto !important",
    height: "auto",
    padding: "12px 0px",
    background: "#FFFFFF",
    boxShadow: "2px 2px 11px 2px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(0, 1),
    },
  },
  cardImage: {
    height: "100%",
    width: "100%",
    position: "absolute",
    objectFit: "contain",
    top: 0,
    left: 0,
  },
  imageContainer: {
    position: "relative",
    "&::before": {
      display: "block",
      content: "''",
      position: "relative",
      paddingTop: "75%",
    },
  },
  cardTagContainer: {
    background: "#FFFFFF",
    boxShadow: "2px 10px 40px -10px rgba(0, 0, 0, 0.5)",
    borderRadius: "5px",
    maxWidth: "180px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    textDecoration: "none",
    [theme.breakpoints.down("xs")]: {
      maxWidth: "112px",
    },
  },
  cardTagText: {
    color: "#2D2866",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "20px",
    lineHeight: "22px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "16px",
      lineHeight: "18px",
    },
  }
}));

const CharacterSliderElement = (props) => {
  const { element } = props;
  const characters = usePageData(data => element?.characters ?? data.characters ?? []);
  const character = usePageData(data => data.character);
  const classes = useStyles();

  const {
    slides,
  } = useMemo(() => {
    const slides = !!character ? [character, ...characters?.filter(item => item.id != character?.id)] : characters;
    return {
      slides,
    };
  }, [characters, character]);

  if (!slides.length)
    return null;

  return (
    <Box className={classes.root}>
      <Container disableGutters maxWidth="xs">
        <Slider
          {...settings}
          className="character-slider"
        >
          {slides.map((character) => (
            <Box className={classes.cardContainer} key={character.id}>
              <Box className={classes.imageContainer}>
                <img className={classes.cardImage} src={character.image} />
              </Box>
              <Box component="a" href={`/character/${character.handle}`} className={classes.cardTagContainer}>
                <Typography className={classes.cardTagText}>{character.name}</Typography>
              </Box>
            </Box>
          ))}
        </Slider>
      </Container>
    </Box>
  )
}
export default CharacterSliderElement;
