import React, { Fragment } from "react";
import { Box, Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ShowMoreText from "react-show-more-text";
import { usePageData } from "@ktwebsite/hooks";

const useStyles = makeStyles((theme) => ({
  footerAboutTitle: {
    [theme.breakpoints.down("xs")]: {
      textAlign: "center",
    },
  },
  footerAboutText: {
    wordWrap: "break-word",
    lineHeight: "28px",
    fontSize: "14px",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  footerAboutImage: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  footerAboutTextTablet: {
    fontFamily: "Barlow-Regular",
    lineHeight: "28px",
    fontSize: "14px",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  footerAboutDesktopBox: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "row",
    },
  },
  footerAboutTextMobile: {
    wordWrap: "break-word",
    fontFamily: "Barlow-Regular",
    lineHeight: "28px",
    fontSize: "14px",
    textAlign: "center",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  footerAboutCountry: {
    textAlign: "center",
    fontSize: "14px",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  copyrightText: {
    marginTop: theme.spacing(3),
    fontSize: "14px",
    [theme.breakpoints.down("xs")]: {
      textAlign: "center",
    },
  },
  copyrightLink: {
    color: "#4396c5",
  },
  footerImage: {
    maxWidth: "100%",
    display: "block",
    objectFit: "cover",
  },
}));

const About = (props) => {
  const { footerImage, footerTitle, brandIntro } = props;
  const classes = useStyles();
  const executeOnClick = (isExpanded) => {};

  return (
    <Fragment>
      <Typography variant="subtitle1" className={classes.footerAboutTitle}>
        {footerTitle}
      </Typography>
      <Box className={classes.footerAboutDesktopBox}>
        <Box pr={3} className={classes.footerAboutImage}>
          <img src={footerImage} className={classes.footerImage} />
        </Box>
        <Box>
          <Typography variant="body2" className={classes.footerAboutText}>
            {`${brandIntro}`}
          </Typography>
        </Box>
        <Box className={classes.footerAboutTextTablet}>
          <ShowMoreText
            lines={6}
            more="See More"
            less="See Less"
            onClick={executeOnClick}
            expanded={false}
          >
            {brandIntro}
          </ShowMoreText>
        </Box>
      </Box>
      <Box className={classes.footerAboutTextMobile}>
        <ShowMoreText
          lines={7}
          more="See More"
          less="See Less"
          onClick={executeOnClick}
          expanded={false}
        >
          {brandIntro}
        </ShowMoreText>
      </Box>
      <Typography variant="body2" className={classes.footerAboutCountry}>
        SINGAPORE | MALAYSIA
      </Typography>
      <Typography variant="body2" className={classes.copyrightText}>
        © 2020 Kidztime.{" "}
        <Link
          href="https://www.ngnrs.io/"
          underline="none"
          className={classes.copyrightLink}
        >
          NGNRS Software Solutions
        </Link>
      </Typography>
    </Fragment>
  );
};

export default About;
