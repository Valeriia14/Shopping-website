import { Box, Link, Typography, Hidden } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    paddingLeft: "14px",
    borderBottom: "1px solid #979797",
    overflowX: "clip",
    [theme.breakpoints.down("xs")]: {
      overflowX: "scroll",
      "&::-webkit-scrollbar": { height: "0" },
    },
  },
  sideBarText: {
    fontSize: "18px",
    fontWeight: 900,
    color: "#1e3a3a",
    lineHeight: "68px",
    whiteSpace: "nowrap",
  },
  selectedMarker: {
    fontSize: "18px",
    fontWeight: 900,
    color: "#1e3a3a",
    lineHeight: "68px",
    whiteSpace: "nowrap",
    borderBottom: "5px solid #1e3a3a",
  },
  link: {
    paddingRight: theme.spacing(6),
  },
}));

const AccountTopBar = (props) => {
  const classes = useStyles();
  const { selected } = props;

  const menu = [
    {
      key: "dashboard",
      text: "OVERVIEW",
      link: "/account/dashboard",
    },
    {
      key: "points",
      text: "POINTS",
      link: "/account/points",
    },
    {
      key: "orders",
      text: "ORDERS",
      link: "/account/orders",
    },
    {
      key: "wishlist",
      text: "WISHLIST",
      link: "/account/wishlist",
    },
    {
      key: "profile",
      text: "PROFILE",
      link: "/account/profile",
    },
    {
      key: "addresses",
      text: "ADDRESSES",
      link: "/account/addresses",
    },
    {
      key: "payment-methods",
      text: "PAYMENT METHODS",
      link: "/account/payment_methods",
    },
  ];

  return (
    <Hidden lgUp>
      <Box className={classes.root}>
        {menu.map((item, index) => (
          <Link
            ref={(el) => {
              if (selected === item.key) {
                el?.scrollIntoView({ block: "start", behavior: "smooth" });
              }
            }}
            className={classes.link}
            href={item.link}
            underline="none"
            key={index}
          >
            <Typography
              variant="body2"
              className={
                selected === item.key
                  ? classes.selectedMarker
                  : classes.sideBarText
              }
            >
              {item.text}
            </Typography>
          </Link>
        ))}
      </Box>
    </Hidden>
  );
};

export default AccountTopBar;
