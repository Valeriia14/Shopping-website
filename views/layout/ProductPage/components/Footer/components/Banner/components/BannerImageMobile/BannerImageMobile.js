import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  footerImgMobile: {
    backgroundImage: `url(/images/white-paint-mobile.png)`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "bottom",
    backgroundSize: "cover",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  smileImageMobile: {
    width: "30%",
    marginLeft: "35%",
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(4),
  },
  smileWordMobile: {
    width: "80%",
    marginLeft: "10%",
  },
  freeShippingTextMobile: {
    padding: "3px",
    border: "2px solid #ff1e66",
    borderRadius: "5px",
    width: "50%",
    marginLeft: "25%",
    marginTop: theme.spacing(2),
    color: "#ff1e66",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: 600,
  },
  firstPurchaseTextMobile: {
    textAlign: "center",
    fontWeight: 600,
    fontSize: "16px",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(9),
    color: "#ff1e66",
  },
  bannerHtml: {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'cover'
  }
}));

const Banner = (props) => {
  const classes = useStyles();
  const { bannerHtml } = props;
  return (
    <Grid item xs={12} className={classes.footerImgMobile}>
      {bannerHtml ? (
        <img src={bannerHtml} className={classes.bannerHtml} />
      ) : (
        <Box>
          <img
            src="/images/smiley-colours.png"
            className={classes.smileImageMobile}
          />
          <img
            src="/images/smiles-word.svg"
            className={classes.smileWordMobile}
          />
          <Typography
            variant="body1"
            className={classes.freeShippingTextMobile}
          >
            $4 OFF + FREE SHIPPING
          </Typography>
          <Typography
            variant="body1"
            className={classes.firstPurchaseTextMobile}
          >
            for your 1st purchase
          </Typography>
        </Box>
      )}
    </Grid>
  );
};

export default Banner;
