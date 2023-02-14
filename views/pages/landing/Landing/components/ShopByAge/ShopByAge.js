import {
  Box,
  Button,
  Container,
  Grid,
  Hidden,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import Slider from "react-slick";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#F9F8F4",
    marginTop: 160,
    paddingTop: "160px",
    paddingBottom: "160px",
    [theme.breakpoints.down("xs")]:{
      marginTop: 0,
      paddingTop: "45px",
      paddingBottom: "45px",
     
    }
  },
  container: {
    [theme.breakpoints.down("xs")]:{
      paddingLeft: "0px",
      paddingRight: "0px",
    }
  },  
  textHeader: {
    fontFamily: "Cormorant-SemiBold",
    fontSize: "40px",
    fontWeight: 600,
    lineHeight: "48px",
    textAlign: "center",
    marginBottom: 40,
    [theme.breakpoints.down("xs")]: {
      fontFamily: "Cormorant-SemiBold",
      fontSize: "24px",
      fontWeight: 700,
      lineHeight: "29px",
      textAlign: "center",
    },
  },
  textHeader1: {
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "16px",
    textAlign: "left",
  },
  textHeader2: {
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: "30px",
    textAlign: "left",
  },
  textHeader3: {
    fontSize: "30px",
    fontWeight: 400,
    lineHeight: "36px",
    textAlign: "center",
  },
  textContent: {
    fontSize: "12px",
    fontWeight: 700,
    lineHeight: "16px",
    textAlign: "left",
  },
  textContent1: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "26px",
    textAlign: "center",
    paddingBottom: "18px",
  },
  greenBox: {
    backgroundColor: "#E0E8DF",
    padding: 27,
  },
  blueBox: {
    backgroundColor: "#DFEAEC",
    padding: 27,
  },
  pinkBox: {
    backgroundColor: "#F6EBE7",
    padding: 27,
  },
  button: {
    width: "200px",
    backgroundColor: "black",
    borderRadius: "0px",
    color: "white",
    "&:hover": {
      backgroundColor: "black",
    },
  },
  slider: {
    "& .slick-list": {
    },
    "& .slick-active": {
      padding: "0 20px!important",
    },
    "& .slick-track":{
    }
  },
}));

const ShopByAge = () => {
  const classes = useStyles();
  const content = [
    {
      age: "6 to 18 Month",
      header: "BABY",
      description: "Ut enim ad minim veniam quis ",
      src: "/images/age_6m_8m_banner.svg",
      className: classes.greenBox,
    },
    {
      age: "1 + to 4 Year old",
      header: "BABY",
      description: "Ut enim ad minim veniam quis ",
      src: "/images/age_1_ to_ 4_Year_old.svg",
      className: classes.blueBox,
    },
    {
      age: "5  Year old & Above",
      header: "BABY",
      description: "Ut enim ad minim veniam quis ",
      src: "/images/age_5_year_old_above.svg",
      className: classes.pinkBox,
    },
  ];
  const settings = {
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    initialSlide: 0,
    swipeToSlide: true,
    autoplay: false,
    centerMode: true,
    arrows : false,
  };
  const showContent = () => {
    return (
      <Grid container>
        {content?.map((e, i) => {
          return (
            <Grid item key={i} xs={4}>
              <Box className={e.className}>
                <Box display="flex">
                  <Box display="flex" alignItems="center">
                    <img src="/images/Age_child_icon.svg" alt="Age" />
                  </Box>
                  <Box ml="16px">
                    <Typography className={classes.textHeader1}>
                      FOR AGE
                    </Typography>
                    <Typography className={classes.textContent}>
                      {e.age}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  flexDirection="column"
                  p="45px 0px"
                >
                  <Typography className={classes.textHeader2}>
                    SHOP FOR{" "}
                  </Typography>
                  <Typography className={classes.textHeader3}>
                    {e.header}
                  </Typography>
                  <Typography className={classes.textContent1}>
                    {e.description}
                  </Typography>
                  <Box>
                    <img src={e.src} alt={e.age} />
                  </Box>
                  <Button className={classes.button}>SHOP NOW</Button>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    );
  };
  return (
    <Box className={classes.root}>
      <Container className={classes.container} maxWidth="lg">
        <Box>
          <Typography className={classes.textHeader}>Shop by Age</Typography>
        </Box>
        <Hidden xsDown>{showContent()}</Hidden>
        <Hidden smUp>
          <Slider className={classes.slider} {...settings}>
            {content?.map((e, i) => {
              return (
                <Box key={i}>
                  <Box className={e.className}>
                    <Box display="flex">
                      <Box display="flex" alignItems="center">
                        <img src="/images/Age_child_icon.svg" alt="Age" />
                      </Box>
                      <Box ml="16px">
                        <Typography className={classes.textHeader1}>
                          FOR AGE
                        </Typography>
                        <Typography className={classes.textContent}>
                          {e.age}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      flexDirection="column"
                      p="45px 0px"
                    >
                      <Typography className={classes.textHeader2}>
                        SHOP FOR{" "}
                      </Typography>
                      <Typography className={classes.textHeader3}>
                        {e.header}
                      </Typography>
                      <Typography className={classes.textContent1}>
                        {e.description}
                      </Typography>
                      <Box>
                        <img src={e.src} alt={e.age} />
                      </Box>
                      <Button className={classes.button}>SHOP NOW</Button>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Slider>
        </Hidden>
      </Container>
    </Box>
  );
};

export default ShopByAge;
