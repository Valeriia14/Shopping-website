import { StickyHeaderBox } from "@ktwebsite/components";
import { useCart, useSelfAccount } from "@ktwebsite/hooks";
import doRedirect from "@ktwebsite/utils/doRedirect";
import {
  AppBar,
  Backdrop,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  makeStyles,
  Slide,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { useEffect, useState } from "react";
import BackdropSearch from "../BackdropSearch";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import capitalise from "@ktwebsite/utils/fomatting/capitalise";
import { MenuTabs, SubMenuTab } from "./components";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    overflow: "auto",
  },
  button: {
    minWidth: "14px",
    color: "white",
    padding: "8",
    borderRadius: 25,
  },
  stickyHeaderBox: {
    width: "100vw",
    position: "fixed",
    backgroundColor: "#1e3a3a",
    height: "50px",
    top: 0,
    left: 0,
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    padding: "16px 16px",
    justifyContent: "space-between",
    boxSizing: "border-box",
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
  stickyHeaderBody: {},
  divider: {
    margin: "0px 30px",
  },
  smButton: {
    marginLeft: "8px",
    padding: "0px",
    minWidth: "fit-content",
  },
  headerRightText: {
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "17px",
    textAlign: "left",
    color: "white",
  },
}));

const SlideDrawer = (props) => {
  const { onClose, open, toggleDrawerRight } = props;
  const [openSearch, setOpenSearch] = useState(false);
  const [viewItem, setViewItem] = useState(false);
  const onSearch = () => {
    setOpenSearch(!openSearch);
  };
  const onBackdropSearch = () => {
    setOpenSearch(!openSearch);
  };
  const classes = useStyles();
  const [cart] = useCart();
  const self = useSelfAccount();

  return (
    <Drawer anchor="left" open={open} onClose={onClose} disableEnforceFocus>
      <Box className={classes.root}>
        <StickyHeaderBox className={classes.stickyHeaderBox}>
          <Box display="flex" alignItems="center">
            <Button
              onClick={() => {
                onClose();
                setViewItem(false);
              }}
              className={classes.button}
            >
              <CloseIcon />
            </Button>
            <img src="/images/logo-square.svg" width={"26px"} />
          </Box>
          {openSearch && (
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
          <Box display="flex" alignItems="center">
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
            <Button onClick={toggleDrawerRight()} className={classes.smButton}>
              <img
                src="/images/Shopping_cart_icon.svg"
                alt="Shopping_cart_icon"
                width={"20px"}
              />
              <Typography className={classes.headerRightText}>
                &nbsp;({cart?.cart_items?.length})
              </Typography>
            </Button>
          </Box>
        </StickyHeaderBox>
        {!viewItem && (
          <Slide direction="right" in={!viewItem}>
            <Box mt="50px">
              {self ? (
                <>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p="40px 30px 12px 30px"
                    onClick={() => doRedirect("/account/profile")}
                  >
                    <Box display="flex" alignItems="center">
                      <Box display="flex" alignItems="center" mr={1}>
                        <img src="/images/Account_icon.svg" width={"24px"} />
                      </Box>
                      <Typography>
                        Hi,
                        {capitalise(self?.firstname) +
                          " " +
                          capitalise(self?.lastname)}
                      </Typography>
                    </Box>
                    <ArrowForwardIosIcon fontSize="small" />
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    p="0px 30px 12px 30px"
                  >
                    <Box display="flex" alignItems="center" mr={1}>
                      <img src="/images/Wishlist_icon.svg" width={"24px"} />
                    </Box>
                    <Typography>Wishlist (0)</Typography>
                  </Box>
                  {/* <Box p="0px 30px 40px 30px">....</Box> */}
                </>
              ) : (
                <>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    p="40px 30px 30px 30px"
                    onClick={() => doRedirect("/auth/signin")}
                  >
                    <Box display="flex" alignItems="center">
                      <Box display="flex" alignItems="center" mr={1}>
                        <img src="/images/Account_icon.svg" width={"24px"} />
                      </Box>
                      <Typography>
                        Login now !
                      </Typography>
                    </Box>
                    <ArrowForwardIosIcon fontSize="small" />
                  </Box>
                </>
              )}
              <Divider className={classes.divider} />
              <MenuTabs setViewItem={setViewItem} />
            </Box>
          </Slide>
        )}
        {viewItem && (
          <Slide direction="left" in={!!viewItem}>
            <Box mt="50px">
              <SubMenuTab viewsItem={viewItem} setViewItem={setViewItem} />
            </Box>
          </Slide>
        )}
      </Box>
    </Drawer>
  );
};

export default SlideDrawer;
