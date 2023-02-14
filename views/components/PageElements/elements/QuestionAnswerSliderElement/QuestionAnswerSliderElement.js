import KTImage from "@ktwebsite/components/KTImage";
import RatingStar from "@ktwebsite/components/RatingStar";
import { Box, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowLeftSharpIcon from '@material-ui/icons/ArrowLeftSharp';
import ArrowRightSharpIcon from '@material-ui/icons/ArrowRight';
import React, { useMemo } from "react";
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
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  initialSlide: 0,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        centerMode: true,
        dots: false,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        dots: false,
      }
    },
  ]
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    overflow: "hidden",
  },
  reviewCardContainer: {
    height: "auto",
    padding: "30px",
    borderRadius: 10,
    background: "#F3F6F8",
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    textAlign: "center",
  },
  reviewTitle: {
    fontWeight: "normal",
    fontSize: "20px",
    lineHeight: "20px",
    letterSpacing: "0.15px",
    marginTop: "14px",
  },
  reviewDescription: {
    fontWeight: "normal",
    fontSize: "12px",
    lineHeight: "20px",
    letterSpacing: "0.15px",
    marginTop: "50px",
  },
  exploreCardImage: {
    height: "auto",
    width: "54px",
  },
  reviewProductTitle: {
    fontWeight: "normal",
    fontSize: "12px",
    lineHeight: "22px",
    color: theme.palette.primary.main,
    [theme.breakpoints.down("xs")]: {
      marginLeft: "15px"
    }
  },
  exploreBtnBrowse: {
    background: "#2D2866",
    color: "#fff",
    width: "11vw",
    maxWidth: 188,
    borderRadius: 10,
    padding: "8px 4px",
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "auto",
    },
  },
  reviewCardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "60px",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center"
    }
  }
}));

const QuestionAnswerSliderElement = (props) => {
  const classes = useStyles();
  const question_answers = useMemo(()=>{
    return props.element?.question_answers
  }, [ props ])
  return (
    <Box className={classes.root}>
      <Container disableGutters maxWidth="lg">
        <Slider {...settings} infinite={false} className="slick_review_slider_dots">
          {
            question_answers.map((p, key) => (
              <Box key={`slick-item${p.id}`}>
                <Box className={classes.reviewCardContainer}>
                  <Typography className={classes.reviewTitle}>{p.question}</Typography>
                  <Typography className={classes.reviewDescription}>{p.answer}</Typography>
                </Box>
              </Box>
            ))
          }
        </Slider>
        
      </Container>
    </Box>

  )
}

export default QuestionAnswerSliderElement;
