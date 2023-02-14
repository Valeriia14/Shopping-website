import { BaseButton } from "@ktwebsite/components";
import { useSelfAccount } from "@ktwebsite/hooks";
import doRedirect from "@ktwebsite/utils/doRedirect";
import {
  Button,
  Divider,
  Hidden,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import React, { Fragment, useMemo } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    textTransform: "none",
  },
  text: {
    fontSize: "14px",
    fontWeight: "500",
    [theme.breakpoints.down("md")]: {
      fontSize: "13px",
    },
  },
  image: {
    border: "4px solid rgba(255,255,255,.3)",
    backgroundClip: "padding-box",
    backgroundColor: "white",
    marginLeft: theme.spacing(1),
    borderRadius: "18px",
    height: 40,
    width: 40,
  },
  signinIcon: {
    marginRight: "5px",
  },
  icon: {
    height: "24px",
    marginRight: "6px",
  },
  headerRightText: {
    fontSize: "14px",
    fontWeight: "500",
    textTransform: "none",
    letterSpacing: "1px",
    [theme.breakpoints.down("md")]: {
      fontSize: "13px",
    },
  },
  badgeCart: {
    height: "20px",
    width: "20px",
    borderRadius: "20px",
    fontSize: "10px",
    top: "-2px",
    left: "3px",
    fontWeight: "700",
  },
  badgeCartColorPrimary: {
    color: "black",
    background: "white",
  },
  arrowUp: {
    transform: "rotate(-90deg)",
    marginLeft: "3px",
    filter: "invert(100%)",
  },
  arrowDown: {
    transform: "rotate(90deg)",
    marginLeft: "3px",
    filter: "invert(100%)",
  },
  imgMenu: {
    width: "20px",
    maxHeight: "20px",
    objectFit: "contain",
    marginRight: "6px",
  },

  accountBtn: {
    display: "flex",
    alignItems: "center",
  },
  nameAccount: {
    maxWidth: "57px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const AccountButton = (props) => {
  const classes = useStyles();
  const self = useSelfAccount();
  const { color = "inherit", toggleDrawerRight, cartValue, cartSize } = props;

  const link = !self ? "/auth/signin" : "/account/dashboard";
  const onSignOut = () => {
    document.cookie = `authorization=; expires=${moment().format()}; path=/;`;
    localStorage.removeItem("sessionToken");
    doRedirect("/auth/signin");
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openModal = anchorEl;
  const handleOpenModal = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseModal = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <Hidden smDown>
        <BaseButton
          onClick={toggleDrawerRight()}
          text={`Bag (${cartSize})`}
          textClassName={classes.headerRightText}
          iconComponent={
            <img
              src="/images/Shopping_cart_icon.svg"
              className={classes.icon}
            />
          }
        />
      </Hidden>
      {!!self && (
        <Button
          ml={2}
          aria-controls={openModal ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openModal ? "true" : undefined}
          onClick={handleOpenModal}
          color={color}
          className={`${classes.root} ${classes.accountBtn}`}
        >
          <Fragment>
            <img
              src="/images/person.svg"
              style={{ widht: "24px", marginRight: "6px" }}
            />
            <Typography className={`${classes.text} ${classes.nameAccount}`}>
              {self?.firstname ? `Hi, ${self.firstname}` : ""}
            </Typography>
            <img
              src="/images/arrow_right_mini.svg"
              className={openModal ? `${classes.arrowDown}` : classes.arrowUp}
              alt="arrow"
            />
          </Fragment>
        </Button>
      )}
      {!!self && (
        <Menu
          style={{ outline: "none" }}
          id="basic-menu"
          anchorEl={anchorEl}
          PaperProps={{
            style: {
              borderRadius: "0",
              width: "300px",
              padding: "0 25px",
              boxShadow: "none",
              border: "1px solid #1E3A3A",
              boxSizing: "border-box",
              outline: "none",
              marginTop: "70px",
            },
          }}
          open={openModal}
          onClose={handleCloseModal}
        >
          <MenuList style={{ outline: "none" }}>
            <MenuItem onClick={() => doRedirect("/account/dashboard")}>
              <img
                src="/images/overview-icon.svg"
                className={classes.imgMenu}
                alt=""
              />
              <ListItemText>Account Overview</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => doRedirect("/account/points")}>
              <img
                src="/images/point-icon.svg"
                className={classes.imgMenu}
                alt=""
              />
              <ListItemText>Points</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => doRedirect("/account/orders")}>
              <img
                src="/images/close_box.svg"
                className={classes.imgMenu}
                alt=""
              />
              <ListItemText>Orders</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => doRedirect("/account/wishlist")}>
              <img
                src="/images/Wishlist_icon.svg"
                className={classes.imgMenu}
                alt=""
              />
              <ListItemText>Wishlist</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => doRedirect("/account/profile")}>
              <img
                src="/images/file_icon.svg"
                className={classes.imgMenu}
                alt=""
              />
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => doRedirect("/account/addresses")}>
              <img
                src="/images/marker_icon.svg"
                className={classes.imgMenu}
                alt=""
              />
              <ListItemText>Addresses</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => doRedirect("/account/payment_methods")}>
              <img
                src="/images/card_icon.svg"
                className={classes.imgMenu}
                alt=""
              />
              <ListItemText>Payment Methods</ListItemText>
            </MenuItem>
            <Divider style={{ margin: "15px 0 5px 0" }} />
            <MenuItem onClick={onSignOut}>
              <img
                src="/images/Sign_out_icon.svg"
                className={classes.imgMenu}
                alt=""
              />
              <ListItemText>Sign Out</ListItemText>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
      <Hidden mdUp>
        <BaseButton
          onClick={toggleDrawerRight()}
          iconComponent={
            <img src="/images/cart-icon.svg" className={classes.icon} />
          }
          text={`${cartValue.toFormat(2)} (${cartSize})`}
          textClassName={classes.headerRightText}
        />
      </Hidden>
      {!self && (
        <Button ml={2} color={color} className={classes.root} href={link}>
          <>
            <img
              src="/images/login24.svg"
              className={classes.signinIcon}
            />
            <Typography className={classes.text}>Sign In</Typography>
          </>
        </Button>
      )}
    </Fragment>
  );
};

export default AccountButton;
