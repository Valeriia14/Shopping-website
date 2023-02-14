import {
  AppBar,
  Box,
  Button,
  Grid,
  Hidden,
  InputBase,
  Toolbar,
  Typography,
  Popper,
  Backdrop,
  CircularProgress,
  Container,
  Badge,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import React, { Fragment, useEffect, useState } from "react";
import { useCart, usePageData } from "@ktwebsite/hooks";
import doRedirect from "@ktwebsite/utils/doRedirect";
import BaseButton from "../../../BaseButton";

const TabsBar = (props) => {
  const { onClick, onBackdropSearch, openSearch, trigger, toggleDrawerRight } =
    props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cart] = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const pageData = usePageData();
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    let mounted = true;
    return () => (mounted = false);
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

  const onSearch = () => {
    onBackdropSearch(!openSearch);
  };

  const handleSubmitSearch = () => {
    doRedirect(`/search?search=${searchTerm}`);
  };

  const onHandleChangeSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Fragment>
      <AppBar color="transparent" className={classes.root}>
        <Container className={classes.container} maxWidth="lg">
          <Grid container alignItems="center">
            <Hidden xsDown>
              <Grid item xs={6} lg={6} className={classes.rightWrap}>
                <Box className={classes.tags}>
                  <Typography className={classes.shippingText}>
                    <img
                      src="/images/truck.svg"
                      className={classes.truck}
                      alt="truck"
                    />
                    Free Shipping above $30
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} lg={6} className={classes.leftWrap}>
                <Box className={classes.searchBarBox}>
                  <Box className={classes.searchBarWrap}>
                    <div className={classes.searchIconWrap}>
                      <img
                        src="/images/search-icon.svg"
                        className={classes.searchIcon}
                        width={"25px"}
                      />
                    </div>
                    <InputBase
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      placeholder="Search any product here.."
                      inputProps={{ "aria-label": "search" }}
                      onChange={onHandleChangeSearchTerm}
                      onKeyPress={(event) => {
                        const keyCode =
                          event.which || event.charCode || event.keyCode || 0; // detect Enter
                        if (keyCode == 13) {
                          event && event.preventDefault();
                          handleSubmitSearch();
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Hidden>

            <Hidden smUp>
              <Grid item xs={2}>
                <Button className={classes.smButton} onClick={onClick}>
                  <MenuIcon className={classes.menuIcon} />
                </Button>
              </Grid>
              <Grid item xs={5}>
                <Button color="inherit" className={classes.buttonText}>
                  <img src="/images/logo-square.svg" className={classes.logo} />
                </Button>
              </Grid>
              <Grid item xs={5} className={classes.rightWrapMobile}>
                <Button onClick={onSearch} className={classes.smButton}>
                  <img
                    src="/images/Search_icon.svg"
                    alt="Search_icon"
                    width={"20px"}
                  />
                </Button>
                <Backdrop
                  className={classes.backdrop}
                  open={openSearch}
                  onClick={onSearch}
                />

                <Button
                  onClick={toggleDrawerRight()}
                  className={classes.smButton}
                >
                  <img
                    src="/images/Shopping_cart_icon.svg"
                    alt="Shopping_cart_icon"
                    width={"20px"}
                  />
                  <Typography className={classes.headerRightText}>
                    &nbsp;({cart?.cart_items?.length})
                  </Typography>
                </Button>
              </Grid>
            </Hidden>
          </Grid>
        </Container>
      </AppBar>
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 85,
    height: 80,
    backgroundColor: "#FAF8F3",
    borderTop: "1px solid",
    borderBottom: "1px solid",
    boxSizing: "content-box",
    boxShadow: "none",
    zIndex: 3,
    [theme.breakpoints.down("xs")]: {
      height: "80px",
      padding: "8px 20px",
      marginTop: "0px",
      justifyContent: "center",
      boxSizing: "border-box",
      backgroundColor: "#1e3a3a",
    },
  },
  button: {
    margin: theme.spacing(0, 1),
    [theme.breakpoints.down("xs")]: {
      margin: 0,
    },
  },
  smButton: {
    minWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  searchBarBox: {
    width: "60%",
    display: "flex",
    position: "relative",
  },
  searchBarWrap: {
    width: "100%",
    display: "flex",
    position: "relative",
  },
  searchIconWrap: {
    position: "absolute",
    top: "25px",
  },
  inputRoot: {
    color: "#000000",
    fontSize: "14px",
    width: "100%",
    fontWeight: 600,
    "& input::placeholder": { color: "#000000", opacity: 1 , fontWeight: 600,fontSize: "14px",},
  },
  inputInput: {
    paddingLeft: `40px`,
    borderBottom: "1px solid",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "17px",
    paddingBottom: `12px`,
  },
  searchIcon: {
    fontSize: "18px",
    color: "grey",
    [theme.breakpoints.down("xs")]: {
      fontSize: "24px",
      color: "inherit",
    },
  },
  menuIcon: {
    fontSize: "24px",
  },
  icon: {
    fontSize: "16px",
    marginRight: theme.spacing(0.5),
  },
  headerRightText: {
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "17px",
    textAlign: "left",
    color: "white",
  },
  rightWrap: {
    display: "flex",
    justifyContent: "center",
    borderRight: "1px solid",
    height: "80px",
  },
  rightWrapMobile: {
    display: "flex",
    justifyContent: "flex-end",
  },
  leftWrap: {
    display: "flex",
    justifyContent: "center",
    height: "80px",
  },
  tags: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "50px",
  },
  backdrop: {
    zIndex: 1500,
    color: "#fff",
  },
  shippingText: {
    fontWeight: 600,
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    textTransform: "none",
    letterSpacing: "2.5px",
    [theme.breakpoints.down("md")]: {
      fontSize: "18px",
    },
  },
  truck: {
    width: "24px",
    marginRight: theme.spacing(2),
  },
  container: {
    padding: 0,
  },
}));

export default TabsBar;
