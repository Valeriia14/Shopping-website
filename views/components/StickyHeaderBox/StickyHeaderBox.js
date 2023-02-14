import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CloseIcon from "@material-ui/icons/Close";
import doRedirect from "@ktwebsite/utils/doRedirect";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    position: "fixed",
    backgroundColor: "  #1e3a3a",
    top: 0,
    left: 0,
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    padding: "16px 16px",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
  button: {
    minWidth: "14px",
    color: "white",
    padding: "8",
    borderRadius: 25,
  },
  title: {
    fontSize: "26px",
    color: "white",
    textTransform: "uppercase",
  },
}));

const StickyHeaderBox = (props) => {
  const { name, backPath, children, className } = props;
  const classes = useStyles();
  const prevUrl = useMemo(() => {
    return localStorage.getItem("prevUrl") || "/";
  }, []);
  return (
    <Box className={className || classes.root}>
      {children}
      {!children && (
        <>
          <Button
            onClick={() => {
              backPath && doRedirect(backPath);
            }}
            disabled={!backPath}
            className={classes.button}
          >
            {backPath && <ArrowBackIosIcon />}
          </Button>
          <Box>
            <Typography variant="h1" className={classes.title}>
              {name}
            </Typography>
          </Box>
          <Button
            onClick={() => doRedirect(prevUrl)}
            className={classes.button}
          >
            <CloseIcon />
          </Button>
        </>
      )}
    </Box>
  );
};

export default StickyHeaderBox;
