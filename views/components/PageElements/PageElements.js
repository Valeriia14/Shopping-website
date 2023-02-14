import { usePageOverride, usePageElements } from "@ktwebsite/hooks";
import { Box, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React, { useMemo } from "react";
import { PageElement } from "./elements";

const PageElements = (props) => {
  const { children, position, elements: elementsOverride, className, ...rest } = props;
  const pageElements = elementsOverride ?? usePageElements();
  const classes = useStyles();

  const elements = useMemo(() => {
    return pageElements?.filter(element => element.position === position) ?? [];
  }, [pageElements]);

  if (!elements.length) return null;

  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      {elements.map((element) => (
        <PageElement key={element.id + '-' + element.type} element={element} />
      ))}
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default PageElements;
