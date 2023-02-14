import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  footerImg: {
    backgroundImage: `url(/images/white-paint.svg)`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  freeShippingBox: {
    width: "50%",
    marginLeft: "6%",
    color: "#ff1e66",
    border: "2px solid #ff1e66",
    borderRadius: "5px",
    textAlign: "center",
    [theme.breakpoints.down("md")]: {
      width: "70%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    },
  },
  freeShippingText: {
    fontSize: "13px",
    fontWeight: 600,
    [theme.breakpoints.down("sm")]: {
      fontSize: "11px",
    },
  },
  rewardBox: {
    width: "100%",
    marginLeft: "6%",
  },
  rewardText: {
    color: "#ff1e66",
    fontSize: "2.0rem",
    fontWeight: 600,
    [theme.breakpoints.down("sm")]: {
      fontSize: "22px",
    },
  },
  smileBox: {
    width: "50%",
    marginLeft: "6%",
  },
  smileWord: {
    maxWidth: "340px",
    [theme.breakpoints.down("md")]: {
      maxWidth: "318px",
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: "230px",
    },
  },
  smileImage: {
    width: "144px",
    [theme.breakpoints.down("md")]: {
      width: "136px",
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100px",
    },
  },
  bannerHtml: {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'cover'
  }
}));

const BannerImageDesktop = (props) => {
  const classes = useStyles();
  const { bannerHtml } = props;
  return (
    <Grid item sm={6} xs={12} className={classes.footerImg}>
      {bannerHtml ? (
        <img src={bannerHtml} className={classes.bannerHtml} />
      ) : (
        <>
          <Box mt={4} className={classes.freeShippingBox}>
            <Typography variant="body1" className={classes.freeShippingText}>
              $4 OFF + FREE SHIPPING FOR YOUR FIRST PURCHASE
            </Typography>
          </Box>
          <Box className={classes.rewardBox}>
            <Typography variant="body1" className={classes.rewardText}>
              Kidztime rewards with
            </Typography>
          </Box>
          <Box
            mb={4}
            className={classes.smileBox}
            display="flex"
            flexDirection="row"
          >
            <Box>
              <img
                src="/images/smiles-word.svg"
                className={classes.smileWord}
              />
            </Box>
            <Box mt={-3}>
              <img
                src="/images/smiley-colours.png"
                className={classes.smileImage}
              />
            </Box>
          </Box>
        </>
      )}
    </Grid>
  );
};

export default BannerImageDesktop;
