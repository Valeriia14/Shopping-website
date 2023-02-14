import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";

const ProductGalleryItem = (props) => {
  const { children, className, src, active, ...rest } = props;
  const classes = useStyles();

  return (
    <Box {...rest} className={clsx(classes.root, className, { [classes.active]: active })}>
      <img src={src} />
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "1em",
    height: "1em",
    position: "relative",
    background: "#fff",
    overflow: "hidden",
    borderRadius: theme.spacing(2),
    cursor: "pointer",
    border: "4px solid #B3B1C7",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      background: "url(/images/placeholder.png)",
      backgroundSize: "cover",
      display: "block",
    },
  },
  active: {
    border: "4px solid #2D2866",
  },
}));

export default ProductGalleryItem;
