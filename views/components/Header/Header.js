import { useCart, useSelfAccount } from "@ktwebsite/hooks";
import useApi from "@ktwebsite/utils/api/useApi";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import doRedirect from "@ktwebsite/utils/doRedirect";
import {
  AppBar,
  Box,
  Grid,
  Hidden,
  Slide,
  useScrollTrigger,
  Typography,
  Container,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useEffect, useMemo, useState } from "react";
import BaseButton from "../BaseButton";
// import SideDrawer from "../SideDrawer";
import AccountButton from "./components/AccountButton";
import SlideDrawer from "./components/SlideDrawer";
import BackdropSearch from "./components/BackdropSearch";
import TabsBar from "./components/TabsBar";
import SubMenuBar from "./components/SubMenuBar";
import MenuBar from "./components/MenuBar";
import { parseNumber } from "@ktwebsite/utils/strings/generators";
import { calSubtotal } from "@ktwebsite/utils/fomatting/calculate";
import { usePageData } from "@ktwebsite/hooks";
import DrawerRight from "./components/DrawerRight";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 165,
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      marginBottom: 80,
    },
  },
  appBar: {
    flexDirection: "column",
    height: 85,
    justifyContent: "center",
    [theme.breakpoints.up("sm")]: {
      padding: "0 20px",
    },
    [theme.breakpoints.up("md")]: {
      paddingRight: "20px",
      paddingLeft: "0px",
    },
    [theme.breakpoints.up("lg")]: {
      padding: "0",
    },
  },
  toolbar: {
    justifyContent: "space-between",
    height: 85,
    [theme.breakpoints.down("xs")]: {
      height: 60,
    },
  },
  toolbarBackdrop: {
    justifyContent: "space-between",
    height: 80,
  },
  toolbarToggled: {
    justifyContent: "space-between",
    height: 85,
    [theme.breakpoints.down("xs")]: {
      backgroundColor: "white",
    },
  },
  shippingIcon: {
    width: 25,
    marginRight: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      width: 20,
    },
  },
  icon: {
    fontSize: "16px",
    marginRight: "10px",
    width: "24px",
  },
  iconToggled: {
    fontSize: "16px",
    marginRight: theme.spacing(0.5),
    color: theme.palette.primary.main,
  },
  rightWrap: {
    display: "flex",
    justifyContent: "flex-end",
  },
  centerText: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      justifyContent: "flex-start",
      padding: theme.spacing(0, 2.5),
    },
  },
  shippingText: {
    fontWeight: 800,
    fontSize: "20px",
    [theme.breakpoints.down("md")]: {
      fontSize: "18px",
    },
  },
  headerLeftText: {
    fontSize: "16px",
    fontWeight: "bold",
    textTransform: "none",
  },
  headerRightTextToggled: {
    fontSize: "14px",
    fontWeight: "500",
    [theme.breakpoints.down("md")]: {
      fontSize: "13px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "13px",
      color: theme.palette.primary.main,
    },
  },
  menuIcon: {
    fontSize: "24px",
    marginRight: theme.spacing(1),
  },
  menuIconToggled: {
    fontSize: "24px",
    marginRight: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      color: theme.palette.primary.main,
    },
  },
  xsHeader: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoWrap: {
    display: "flex",
    justifyContent: "right",
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(0, 2),
    },
  },
  logoImage: {
    width: "40px",
  },
  headerSubMsg: {
    color: "red",
    padding: "0",
    textAlign: "center",
    display: "block",
  },
  container: {
    padding: 0,
  },
  subMenuContainer: {
    position: "absolute",
    width: "100vw",
    top: "74px",
    backgroundColor: "#F7F7F6",
    color: "black",
    overflow: "overlay",
    maxHeight: "80vh",
  },
}));

const Header = (props) => {
  const pageData = usePageData();
  const classes = useStyles();
  const [cart] = useCart();
  const [toggleState, setToggleState] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const trigger = useScrollTrigger();
  const [menuActive, setMenuActive] = useState(null);

  const { cartSize, cartValue } = useMemo(() => {
    return {
      cartSize: cart?.cart_items?.length ?? 0,
      cartValue: parseNumber(calSubtotal(cart?.cart_items)),
    };
  }, [cart]);

  useEffect(() => {
    let mounted = true;
    return () => (mounted = false);
  }, []);

  const toggleDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    )
      return;
    setToggleState(!toggleState);
  };

  const toggleDrawerRight = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    )
      return;
    setIsOpen(!isOpen);
  };

  const onBackdropSearch = () => {
    setSearch(!search);
  };

  const toHome = () => {
    doRedirect("/");
  };

  const settingsObj = pageData?.settings?.reduce((prev, current) => {
    prev[current.value] = current;
    return prev;
  }, {});

  const logo = useMemo(() => {
    const logoBrand = settingsObj?.logo?.asset?.uri;
    return logoBrand ? logoBrand : "/images/logo-square.svg";
  }, [settingsObj]);

  const trending = useMemo(() => {
    let trending = ""
    if(pageData?.trending?.length){
      trending = pageData.trending[0].uri
    }
    return trending ? trending : "/images/placeholder.png";
  }, [pageData]);

  return (
    <>
      <Slide direction="down" in={!trigger}>
        <Box className={classes.root}>
          <Hidden xsDown>
            <AppBar color="primary" position="fixed" className={classes.appBar}>
              <Container className={classes.container} maxWidth="lg">
                <Grid container alignItems="center">
                  <Hidden smDown>
                    <Grid item xs={6} lg={9} className={classes.centerText}>
                      <BaseButton
                        imageSource={logo}
                        imageClassName={classes.logoImage}
                        onClick={() => toHome()}
                      />
                      <MenuBar
                        setMenuActive={setMenuActive}
                        menuActive={menuActive}
                      />
                    </Grid>
                    <Grid item xs={6} lg={3} className={classes.rightWrap}>
                      <AccountButton
                        toggleDrawerRight={toggleDrawerRight}
                        cartValue={cartValue}
                        cartSize={cartSize}
                      />
                    </Grid>
                  </Hidden>
                  <Hidden only={["xs", "md", "lg", "xl"]}>
                    <Grid item sm={2}>
                      {!toggleState && (
                        <BaseButton
                          onClick={toggleDrawer()}
                          iconComponent={
                            <MenuIcon className={classes.menuIcon} />
                          }
                          text="Shop by Categories"
                          textClassName={classes.headerLeftText}
                        />
                      )}
                      {!!toggleState && (
                        <BaseButton
                          onClick={toggleDrawer()}
                          iconComponent={
                            <CloseIcon className={classes.menuIcon} />
                          }
                        />
                      )}
                    </Grid>
                    <Grid item sm={5} className={classes.centerText}>
                      <BaseButton
                        imageSource={logo}
                        imageClassName={classes.logoImage}
                      />
                    </Grid>
                    <Grid item sm={5} className={classes.rightWrap}>
                      <AccountButton
                        toggleDrawerRight={toggleDrawerRight}
                        cartValue={cartValue}
                        cartSize={cartSize}
                      />
                    </Grid>
                  </Hidden>
                </Grid>
              </Container>
              {menuActive && (
                <Box
                  onMouseLeave={(event) => {
                    setMenuActive(false);
                  }}
                  className={classes.subMenuContainer}
                >
                  <Container className={classes.container} maxWidth="lg">
                    <Box padding="50px 0px">
                      <Grid container>
                        <Grid xs={9} container item>
                          <SubMenuBar subMenu={menuActive?.sub_menu} />
                        </Grid>
                        <Grid xs={3} item>
                          <Box>
                            <Box>
                              <img src={trending} alt="banner" />
                            </Box>
                            <Typography>
                              <b>#TRENDING</b> - Silicone self feeding utensils
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Container>
                </Box>
              )}
            </AppBar>
          </Hidden>
          {!toggleState && !!search && (
            <Hidden smUp>
              <AppBar
                color="primary"
                position="fixed"
                className={classes.appBar}
              >
                <Box mr="20px">
                  <BackdropSearch onClick={onBackdropSearch} />
                </Box>
              </AppBar>
            </Hidden>
          )}

          <TabsBar
            onClick={() => setToggleState(!toggleState)}
            onBackdropSearch={onBackdropSearch}
            toggleDrawerRight={toggleDrawerRight}
            trigger={trigger}
            openSearch={search}
          />
          <SlideDrawer
            onClose={() => setToggleState(!toggleState)}
            open={toggleState}
            toggleDrawerRight={toggleDrawerRight}
          />
          <DrawerRight onToggle={toggleDrawerRight()} open={isOpen} />
        </Box>
      </Slide>
      {/* <Typography variant="caption" className={classes.headerSubMsg}>
        {headerSub}
      </Typography> */}
    </>
  );
};

export default Header;
