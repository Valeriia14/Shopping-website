import { Box, Link, Typography, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment } from "react";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { isBefore } from "date-fns";
const useStyles = makeStyles((theme) => ({
  root: {},
  sideBarText: {
    padding: theme.spacing(3, 0, 3, 2),
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "21px",
    color: "#333333",
  },
  selectedMarker: {
    padding: theme.spacing(3, 0, 3, 2),
    fontWeight: 900,
    fontSize: "18px",
    lineHeight: "21px",
    color: "#000000",
    position: "relative",
  },
  thumb: {
    display: "none",
  },
  activeThumb: {
    display: "block",
    position: "absolute",
    left: "0",
    top: "50%",
    backgroundColor: "#1E3A3A",
    width: "4px",
    height: "60%",
    transform: "translateY(-50%)",
  },
  icon: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: "auto",
    width: "10px",
  },
  Divider: {
    backgroundColor: "#E3E3E3",
  },
}));

const AccountSideBar = (props) => {
  const classes = useStyles();
  const { selected } = props;
  const menu = [
    {
      key: "dashboard",
      text: "ACCOUNT OVERVIEW",
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
    <Box className={classes.root}>
      <Box pr={3} pt={3}>
        {menu.map((item, index) => (
          <Fragment key={index}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexDirection="row"
            >
              <Box>
                <Link href={item.link} underline="none">
                  <Typography
                    variant="body2"
                    className={
                      selected === item.key
                        ? classes.selectedMarker
                        : classes.sideBarText
                    }
                  >
                    {item.text}
                    <Box
                      className={
                        selected === item.key
                          ? classes.activeThumb
                          : classes.thumb
                      }
                    ></Box>
                  </Typography>
                </Link>
              </Box>
              {selected === item.key ? (
                <img
                  className={classes.icon}
                  src="/images/arrow_right_bold.svg"
                />
              ) : (
                <img
                  className={classes.icon}
                  src="/images/arrow_right_light.svg"
                />
              )}
            </Box>
            {menu.length - 1 !== index && (
              <Divider className={classes.Divider} />
            )}
          </Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default AccountSideBar;
