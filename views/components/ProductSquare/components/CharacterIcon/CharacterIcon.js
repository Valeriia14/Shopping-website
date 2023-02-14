import ProductImage from "@ktwebsite/components/ProductImage";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    height: theme.spacing(6),
    width: theme.spacing(6),
    borderRadius: theme.spacing(4),
    overflow: "hidden",
    boxShadow: "0 2px 29px rgba(0,0,0,.2)",
    transition: "transform .1s ease-in-out",
    transformOrigin: "top right",
    "&:hover": {
      transform: "scale(2)",
    },
  },
}));

const CharacterIcon = (props) => {
  const { children, className, ...rest } = props;
  const classes = useStyles();

  return (
    <ProductImage
      {...rest} 
      className={clsx(classes.root, className)} />
  );
};

export default CharacterIcon;
