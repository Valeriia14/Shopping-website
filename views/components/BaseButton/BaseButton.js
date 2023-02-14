import { Box, Button, Typography, Link, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment } from "react";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "&.Mui-disabled": {
      background: "#9e9e9e",
    },
  },
  helperWrap: {
    display: "flex",
    flexDirection: "row",
    marginTop: theme.spacing(1),
  },
  helperText: {
    fontSize: "12px",
    color: "grey"
  },
  helperLink: {
    fontSize: "12px",
    color: "#067dff",
    marginLeft: theme.spacing(0.5),
    "&:hover": {
      color: "#42A5F5",
    },
  },
  progressIcon: {
    color: "white",
  }
}));

const BaseButton = props => {
  const classes = useStyles();
  const {
    disabled,
    onClick, loading, color = "inherit",
    iconComponent, href,
    buttonClassName, buttonVariant,
    text, textClassName, textVariant,
    imageSource, imageClassName,
    helperText, helperClassName,
    helperLink, helperLinkClassName } = props;

  return (
    <Fragment>
      <Button variant={buttonVariant} color={color} className={clsx(classes.root, buttonClassName)} onClick={onClick} disabled={disabled}>
        {!!loading && <CircularProgress className={classes.progressIcon} size={20} />}
        {!loading && (
          <Fragment>
            {imageSource && <img src={imageSource} className={imageClassName} />}
            {iconComponent}
            {text && <Typography variant={textVariant} className={textClassName}>{text}</Typography>}
          </Fragment>
        )}
      </Button>
      {!!helperText || !!helperLink && (
        <Box className={classes.helperWrap}>
          {helperText && <Typography className={clsx(classes.helperText, helperClassName)}>{helperText}</Typography>}
          {helperLink && (
            <Link href={href} underline="none">
              <Typography className={clsx(classes.helperLink, helperLinkClassName)}>{helperLink}</Typography>
            </Link>
          )}
        </Box>
      )}
    </Fragment>
  );
};

export default BaseButton;
