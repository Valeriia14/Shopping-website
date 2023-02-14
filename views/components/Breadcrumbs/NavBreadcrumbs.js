import React from 'react';
import { Breadcrumbs, Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    color: "#000",
    fontWeight: "normal",
    fontSize: "12px",
    lineHeight: "16px",
    marginBottom: theme.spacing(2),
  },
}));

const NavBreadcrumbs = props => {
  const classes = useStyles();
  const { firstTitle, secondTitle, thirdTitle, finalTitle, firstLink, secondLink, thirdLink } = props;

  return (
    <Breadcrumbs aria-label="breadcrumb" separator=">" className={classes.root}>
      {firstTitle && firstLink &&
        <Link color="inherit" href={firstLink}>
          {firstTitle}
        </Link>
      }
      {secondTitle && secondLink &&
        <Link color="inherit" href={secondLink}>
          {secondTitle}
        </Link>
      }
      {thirdTitle && thirdLink &&
        <Link color="inherit" href={thirdLink}>
          {thirdTitle}
        </Link>
      }
      {finalTitle &&
        <span>{finalTitle}</span>
      }
    </Breadcrumbs>
  )
}

export default NavBreadcrumbs;
