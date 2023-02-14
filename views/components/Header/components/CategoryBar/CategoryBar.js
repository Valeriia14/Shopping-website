import { AppBar, Box, Button, Grid, Hidden, InputBase, Toolbar, Typography, Popper, Backdrop, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment, useEffect, useState } from "react";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import BaseLoader from "../../../BaseLoader";
import { useCart, usePageData } from "@ktwebsite/hooks";
import { KTImage } from "@ktwebsite/components";
import doRedirect from "@ktwebsite/utils/doRedirect";

const CategoryBar = props => {
  const { onClick, onBackdropSearch, openSearch, trigger, toggleDrawerRight } = props;
  const classes = useStyles();
  const [isShown, setIsShown] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cart] = useCart();
  const pageData = usePageData();
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    let mounted = true;
    return () => mounted = false;
  }, []);

  const getCategoryUrl = (category) => {
    switch (category.type) {
      case "character":
        return `/character/${category.handle}`;
      case "product_type":
      case "category":
      default:
        return `/category/${category.handle}`;
    }
  };

  const handlePopoverOpen = (event, label) => {
    setAnchorEl(event.currentTarget);
    setIsShown({
      [label]: true
    });
  };

  const handlePopoverClose = (label) => {
    setAnchorEl(null);
    setIsShown({
      [label]: false
    });
  };

  return (
    <Fragment>
      <Toolbar>
        <Grid container alignItems="center" className={classes.rightWrap}>
          <Hidden xsDown>
            <Grid item md={12} lg={12}>
              <Hidden mdDown>
                <Box className={classes.tags}>
                  {pageData.banners?.map((banner, index) => (
                    <div key={index} onMouseEnter={(event) => handlePopoverOpen(event, banner.label)} onMouseLeave={(event) => handlePopoverClose(event, banner.label)}>
                      <Button
                        className={!!isShown[banner.label] ? classes.buttonActive : classes.buttonInactive}
                        aria-describedby={id}>
                        <Typography className={classes.tabText}>{banner.label}</Typography>
                      </Button>

                      {/* Popper */}
                      {!!isShown[banner.label] && !trigger && (
                        <Popper
                          className={classes.popover}
                          id={id}
                          open={open}
                          anchorEl={anchorEl}
                          placement="bottom-start">
                          <Box className={classes.paper}>
                            {loading && <BaseLoader />}
                            <Box className={classes.paperContent}>
                              {banner.categories?.map((category, index) => (
                                <Box key={index} className={classes.sideImgWrap}>
                                  <a href={getCategoryUrl(category)}>
                                    <KTImage src={category.image} className={classes.sideImg} />
                                  </a>
                                  <Typography className={classes.sideDrawerText}>{category.name}</Typography>
                                </Box>
                              ))}
                            </Box>

                            <Box className={classes.popperbuttonWrap}>
                              <div className={classes.shadow}>
                                <div className={classes.popperbuttonPadding}>
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    className={classes.popperbutton}
                                    onClick={() => console.log("onClick See more")}>
                                    <Typography className={classes.popupButtonText}>See more</Typography>
                                    <ArrowForwardIosIcon className={classes.popupButtonIcon} />
                                  </Button>
                                </div>
                              </div>
                            </Box>
                          </Box>
                        </Popper>)}

                    </div>))}
                </Box>
              </Hidden>
            </Grid>
          </Hidden>
        </Grid>
      </Toolbar>
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 85,
    height: 55,
    backgroundColor: "white",
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(1, 0),
      marginTop: 60,
      height: 80,
      zIndex: 3
    },
  },
  tabText: {
    fontWeight: 500,
    fontSize: "16px",
    color: "white",
    textTransform: "none",
  },
  button: {
    margin: theme.spacing(0, 1),
    [theme.breakpoints.down("xs")]: {
      margin: 0
    },
  },
  buttonInactive: {
    margin: theme.spacing(0, 1),
    padding: theme.spacing(1.5),
    color: "black",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    [theme.breakpoints.down("xs")]: {
      margin: 0
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
  },
  buttonActive: {
    margin: theme.spacing(0, 1),
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    [theme.breakpoints.down("xs")]: {
      margin: 0
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  rightWrap: {
    display: "flex",
    justifyContent: "flex-end",
  },
  popover: {
    zIndex: 1500,
    marginLeft: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  popupText: {
    fontSize: "16px",
    fontWeight: 600,
    color: "black",
  },
  popupButtonText: {
    fontSize: "11px",
    fontWeight: 600,
    color: "black",
  },
  popupButtonIcon: {
    fontSize: "12px",
    marginLeft: theme.spacing(0.5),
    color: "black",
  },
  tags: {
    display: "flex",
    flexDirection: "row",
  },
  popperbutton: {
    display: "flex",
    flexDirection: "row",
    width: 90,
    borderRadius: "10px",
    border: "2px solid",
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.5),
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      border: "2px solid",
      padding: theme.spacing(0.5, 1),
      margin: theme.spacing(0.5),
    },
  },
  popperbuttonPadding: {
    width: theme.spacing(1) + 90,
    border: "1px solid transparent",
    borderRadius: "10px",
    "&:hover": {
      backgroundColor: "lightgrey",
      border: "1px solid transparent",
    },
  },
  shadow: {
    width: theme.spacing(1) + 90,
    borderRadius: "10px",
    boxShadow: "0 1px 3px 0 rgba(77,95,111,.3)",
  },
  popperbuttonWrap: {
    display: "flex",
    justifyContent: "flex-end"
  },
  logo: {
    width: "50px"
  },
  backdrop: {
    zIndex: 1500,
    color: "#fff",
  },
  sideImgWrap: {
    display: "flex",
    flexDirection: "column",
    width: 115,
    height: 150,
    marginBottom: theme.spacing(2),
  },
  sideImg: {
    width: 115,
    height: 105,
  },
  sideDrawerText: {
    fontSize: "16px",
    width: "100%",
    textAlign: "center",
    textTransform: "uppercase"
  },
  paperContent: {
    minWidth: 400,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: theme.spacing(2),
  },
}));

export default CategoryBar;
