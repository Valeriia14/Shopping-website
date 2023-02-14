
import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Link, Icon } from "@material-ui/core";
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";

const useStyles = makeStyles((theme) => ({
  footerBoxDesktop: {
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  footerBoxMobile: {
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  footerText: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    fontWeight: 500,
    color: "#000",
    "&:hover": {
      color: "#4396c5"
    }
  },
  footerSubtitle: {
    [theme.breakpoints.down("xs")]: {
      textAlign: "center"
    }
  },
  footerSocial: {
    backgroundImage: `url(/images/complex-icon.svg)`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "contain",
    width: "64px",
    height: "64px",
  },
  countryFlag: {
    width: "52px",
    height: "52px"
  },
  socialIcon: {
    width: "30px",
    height: "30px",
    color: "#fff",
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  footerSocialBox: {
    justifyContent: "center"
  },
  footerCountryBox: {
    justifyContent: "center"
  }
}));

const ShopWithUs = props => {
  const classes = useStyles();
  return (
    <Fragment>
      <Box pl={8} className={classes.footerBoxDesktop}>
        <Typography variant="subtitle1" className={classes.footerTitle}>Shop with us</Typography>
        <Link href="#" underline="none">
          <Typography variant="body2" className={classes.footerText} >
            Water Bottles
        </Typography>
        </Link>
        <Link href="#" underline="none">
          <Typography variant="body2" className={classes.footerText} >
            Dinnerwares
        </Typography>
        </Link>
        <Link href="#" underline="none">
          <Typography variant="body2" className={classes.footerText} >
            School Bags
        </Typography>
        </Link>
        <Link href="#" underline="none">
          <Typography variant="body2" className={classes.footerText} >
            Accessories &amp; Gears
        </Typography>
        </Link>
        <Link href="#" underline="none">
          <Typography variant="body2" className={classes.footerText} >
            Sales &amp; Clearance
        </Typography>
        </Link>
        <Typography variant="subtitle1">Connect With Us</Typography>
        <Box mt={2} display="flex" flexDirection="row">
          <Box className={classes.footerSocial}>
            <FacebookIcon className={classes.socialIcon} />
          </Box>
          <Box className={classes.footerSocial}>
            <InstagramIcon className={classes.socialIcon} />
          </Box>
        </Box>
        <Typography variant="subtitle1">Shopping Region</Typography>
        <Box mt={2} display="flex" flexDirection="row">
          <Box>
            <img src="/images/flaticon1.png" className={classes.countryFlag} />
          </Box>
          <Box ml={2}>
            <img src="/images/flaticon2.png" className={classes.countryFlag} />
          </Box>
        </Box>
      </Box>
      <Box className={classes.footerBoxMobile}>
        <Typography variant="subtitle1" className={classes.footerSubtitle}>Connect With Us</Typography>
        <Box mt={1} display="flex" flexDirection="row" className={classes.footerSocialBox}>
          <Box className={classes.footerSocial}>
            <FacebookIcon className={classes.socialIcon} />
          </Box>
          <Box className={classes.footerSocial}>
            <InstagramIcon className={classes.socialIcon} />
          </Box>
        </Box>
        <Typography variant="subtitle1" className={classes.footerSubtitle}>Shopping Region</Typography>
        <Box mt={2} display="flex" flexDirection="row" className={classes.footerCountryBox}>
          <Box>
            <img src="/images/flaticon1.png" className={classes.countryFlag} />
          </Box>
          <Box ml={2}>
            <img src="/images/flaticon2.png" className={classes.countryFlag} />
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
};

export default ShopWithUs;
