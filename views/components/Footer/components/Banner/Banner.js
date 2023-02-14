import { Box, Button, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useMemo } from "react";
import BannerImageDesktop from "./components/BannerImageDesktop";
import BannerImageMobile from "./components/BannerImageMobile";
import { usePageData } from "@ktwebsite/hooks";

const useStyles = makeStyles((theme) => ({
  footerBannerBox: {
    backgroundColor: theme.palette.secondary.light,
  },
  bannerText: {
    color: "white",
    width: "60%",
    textAlign: "center",
    marginLeft: "20%",
    marginTop: "8%",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
      marginLeft: "5%",
      fontSize: "16px",
    },
  },
  bannerButtonBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  joinNowButton: {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(2),
    background: "white",
    "&:hover": {
      background: "#E8E8E8",
    },
    fontWeight: 600,
    boxShadow: "0 2px 4px rgba(0,0,0,.5)",
    height: "30px",
    borderRadius: "10px",
    [theme.breakpoints.down("xs")]: {
      color: "#ff1e66",
      fontSize: "20px",
      padding: theme.spacing(2),
    },
  },
  bannerTextWhite: {
    color: "white",
    fontSize: "14px",
    fontWeight: 600,
    [theme.breakpoints.down("xs")]: {
      fontSize: "20px",
    },
  },
  signInButton: {
    color: "white",
    marginLeft: theme.spacing(2),
    background: "transparent",
    fontWeight: 600,
    [theme.breakpoints.down("xs")]: {
      fontSize: "20px",
    },
  },
}));

const Banner = (props) => {
  const classes = useStyles();
  const pageData = usePageData();
  const settingsObj = pageData?.settings?.reduce((prev, current) => {
    prev[current.value] = current;
    return prev;
  }, {});

  const bannerHtml = useMemo(() => {
    return settingsObj && settingsObj?.bannerHtml?.asset?.uri;
  }, [settingsObj]);

  return (
    <Grid container className={classes.footerBannerBox}>
      <BannerImageDesktop bannerHtml={bannerHtml} />
      <BannerImageMobile bannerHtml={bannerHtml} />
      <Grid item sm={6} xs={12}>
        <Box>
          <Typography className={classes.bannerText} variant="body1">
            Sign Up and earn rebates with every dollar spent on all{" "}
            <strong>KIDZTIME PRODUCTS</strong>
          </Typography>
          <Box className={classes.bannerButtonBox} mt={2} mb={2}>
            <Button className={classes.joinNowButton} href="/auth/signup">
              JOIN NOW
            </Button>
            <Typography variant="body1" className={classes.bannerTextWhite}>
              OR
            </Typography>
            <Button className={classes.signInButton} href="/auth/signin">
              SIGN IN
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Banner;
