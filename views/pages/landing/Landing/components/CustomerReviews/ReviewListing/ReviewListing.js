import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { Fragment, useState } from "react";
import Slider from "react-slick";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { RatingStar } from "@ktwebsite/components";
import moment from "moment";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "calc(100% - 25px)",
    padding: "80px 0 82px",
    borderBottom: "6px solid #000000",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      padding: "50px 0 52px",
    },
  },
  reviewBox: {
    width: "95%",
    padding: "20px",
    margin: "0 10px 0 10px",
    height: "650px",
    [theme.breakpoints.down("xs")]: {
      height: "600px",
      margin: "0 10px 0 -38px",
    },
  },
  img: {
    width: "100%",
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      padding: "8px",
    },
  },
  ordinalsBox: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "baseline",
    "& .title": {
      fontSize: "18px",
      fontWeight: "bold",
      lineHeight: "23px",
    },
    "& .date": {
      fontSize: "10px",
      lineHeight: "12px",
    },
  },
  rating: {
    fontSize: 15,
    alignItems: "center",
  },
  ratingBox: {
    borderTop: "0.5px solid #000000",
    borderBottom: "0.5px solid #000000",
    padding: "8px 0px",
    "& p": {
      fontWeight: 500,
      fontSize: "10px",
      lineHeight: "12px",
    },
    [theme.breakpoints.down("xs")]: {
     marginTop:"8px"
    },
  },
  previewBox: {
    display: "flex",
    margin: "25px auto",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  commentBox: {
    borderTop: "0.5px solid #000000",
    "& .title": {
      fontWeight: 300,
      fontSize: "10px",
      lineHeight: "23px",
    },
    "& .comment": {
      fontSize: "14px",
      lineHeight: "18px",
      padding: "10px 0px",
      wordBreak: "break-word",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      maxHeight: "68px",
      WebkitLineClamp: "3",
      WebkitBoxOrient: "vertical"
    },
    "& .account": {
      fontWeight: 500,
      fontSize: "12px",
      lineHeight: "18px",
      textAlign: "right",
    },
  },
}));

const ReviewListing = (props) => {
  const classes = useStyles();
  const { reviews } = props;
  const [swipping, setSwipping] = useState(false);
  const settings = {
    dots: false,
    slidesToShow: reviews && reviews.length < 7 ? reviews.length : 7,
    slidesToScroll: 1,
    infinite: true,
    initialSlide: 0,
    swipeToSlide: true,
    autoplay: false,
    beforeChange: () => {
      setSwipping(true);
    },
    afterChange: () => {
      setSwipping(false);
    },
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: reviews && reviews.length < 3 ? reviews.length : 3,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
          centerMode: true,
        },
      },
    ],
  };
  const getBoxColor = (index) => {
    const arrayColor = ["#F4DBDA", "#E0E8DF", "#DEDCD0", "#FBF5CA", "#DFEAEC"];
    return arrayColor[index % 5];
  };
  return (
    <Box className={classes.root}>
      <Slider {...settings}>
        {!reviews
          ? ""
          : reviews.map((item, index) => {
              return !item.comment ? (
                ""
              ) : (
                <Fragment key={index}>
                  <Box
                    className={classes.reviewBox}
                    style={{ backgroundColor: getBoxColor(index) }}
                  >
                    <Box className={classes.ordinalsBox}>
                      <Typography className="title">Review. </Typography>
                      <Typography className="date">
                        {moment(item?.created_at).format("DD/MM/YY")}
                      </Typography>
                    </Box>
                    <Box
                      display="flex"
                      mt={3}
                      justifyContent="space-between"
                      className={classes.ratingBox}
                    >
                      <Box display="flex">
                        <RatingStar
                          className={classes.rating}
                          score={item?.score}
                        />
                      </Box>
                      <Typography>{item?.score || 0} / 5</Typography>
                    </Box>
                    <Box className={classes.previewBox}>
                    <img
                        className={classes.img}
                        src={
                          item?.product?.preview?.uri ||
                          "/images/placeholder.png"
                        }
                        alt={item?.product?.name}
                        onClick={() => {
                          !swipping &&
                            doRedirect(`/products/${item?.product?.handle}`);
                        }}
                      />
                    </Box>
                    <Box className={classes.commentBox}>
                      <Typography className="title">Remarks</Typography>
                      <Typography className="comment">
                        {item.comment}
                      </Typography>
                      <Typography className="account">
                        {item?.account?.firstname} {item?.account?.lastname}
                      </Typography>
                    </Box>
                  </Box>
                </Fragment>
              );
            })}
      </Slider>
    </Box>
  );
};

export default ReviewListing;
