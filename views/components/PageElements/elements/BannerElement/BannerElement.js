import { Box, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";
import draftToHtml from 'draftjs-to-html';

const useStyles = makeStyles((theme) => ({
  root: {},
  bannerImage: {
    width: "100%",
    [theme.breakpoints.down('sm')]: {
      display: "none",
    },
    [theme.breakpoints.up('sm')]: {
      display: "inherit",
    },
  },
  bannerImageMobile: {
    width: "100%",
    [theme.breakpoints.down('sm')]: {
      display: "inherit",
    },
    [theme.breakpoints.up('sm')]: {
      display: "none",
    },
  },
  heading: {
    fontSize: "26px",
    lineHeight: "39px",
    fontWeight: "normal",
  },
  paragraph: {
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0.444444px",
    maxWidth: "800px",
    margin: "auto",
    textAlign: "center",
  },
}));

const BannerElement = (props) => {
  const { children, className, element, ...rest } = props;
  const classes = useStyles();

  const { header, subheader, img_desk, img_mob } = element?.options;

  const raw = JSON.parse(subheader);
  const subheader_markup = draftToHtml(raw);

  const imageElemDesk = (<img className={classes.bannerImage} src={img_desk} />);
  const imageElemMob = (<img className={classes.bannerImageMobile} src={img_mob} />);

  return (
    <Container disableGutters maxWidth="xl" {...rest} className={clsx(classes.root, className)}>
      {!!element.link && (
        <a href={element.link}>
          {imageElemDesk}
        </a>
      )}

      {!element.link && imageElemDesk}

      {!!element.link && (
        <a href={element.link}>
          {imageElem}
        </a>
      )}

      {!element.link && imageElemMob}
      <Box className={classes.contentSpacer}>
        <Typography align="center" className={classes.heading}>
          {header}
        </Typography>

        <div className={classes.paragraph} dangerouslySetInnerHTML={{__html: subheader_markup}}/>
      </Box>
    </Container>
  );
};

export default BannerElement;
