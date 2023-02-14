import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: "inherit",
    display: "block",
    position: "relative",
    "& img": {
      position: "absolute",
      top: 0,
      left: 0,
      display: "block",
      height: "100%",
      width: "100%",
      objectFit: "contain",
    },
  },
  frame: {
    paddingTop: "100%",
  },
}));

const ProductImage = (props) => {
  const { src, href, className, ...rest } = props;
  const [image, setImage] = useState("/images/placeholder.png");
  const classes = useStyles();

  useEffect(() => {
    if (src) setImage(src);
  }, [src]);

  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      <div className={classes.frame} />
      <a href={href}>
        <img src={image} alt="Product Image" />
      </a>
    </Box>
  );
};

export default ProductImage;
