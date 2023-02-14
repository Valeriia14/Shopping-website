import KTImage from "@ktwebsite/components/KTImage";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowLeftSharpIcon from "@material-ui/icons/ArrowLeftSharp";
import ArrowRightSharpIcon from "@material-ui/icons/ArrowRight";
import React from "react";
import Slider from "react-slick";

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
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [{
    breakpoint: 850,
    settings: {
      centerMode: true,
      slidesToShow: 3,
    }
  }, {
    breakpoint: 700,
    settings: {
      centerMode: true,
      slidesToShow: 1,
    }
  }]
};
const useStyles = makeStyles((theme) => ({
  cardContainer: {
    height: "234px",
    background: "#EEEEFF",
    borderRadius: "10px",
    textAlign: "center",
  },
  cardImage: {
    height: "170px",
    width: "159px",
    margin: "auto",
    padding: "10px",
    [theme.breakpoints.down("xs")]: {
      width: "160px",
    },
  },
  cardTagContainer: {
    background: "#FFFFFF",
    borderRadius: "5px",
    maxWidth: "180px",
    padding: "8px 4px",
    margin: "auto",
  },
  cardTagText: {
    color: "#2D2866",
    overflow: "hidden",
    fontWeight: "normal",
    fontSize: "20px",
    lineHeight: "22px",
    maxHeight: "44px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "16px",
      lineHeight: "18px",
      maxHeight: "36px",
    },
  },
}));

const ProductSlider = (props) => {
  const { products = [] } = props;
  const classes = useStyles();
  return (
    <Slider
      {...settings}
      className="slick_product_image_slider"
    >
      {products.map(product => (
        <Box className={classes.cardContainer} key={product.id}>
          <KTImage className={classes.cardImage} src={product.preview?.uri} />
          <Box className={classes.cardTagContainer}>
            <Typography className={classes.cardTagText}>{product.name}</Typography>
          </Box>

        </Box>
      ))}
    </Slider>
  )
}
export default ProductSlider;
