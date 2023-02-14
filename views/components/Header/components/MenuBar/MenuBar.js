import React, { Fragment } from "react";
import { useCart, usePageData } from "@ktwebsite/hooks";
import {
  Box,
  Button,
  Grid,
  Hidden,
  makeStyles,
  Toolbar,
  Typography,
  Container,
  Divider,
} from "@material-ui/core";

const MenuBar = (props) => {
  const { menuActive, isShown, setMenuActive } = props;
  const classes = useStyles();
  const pageData = usePageData();
  const { menu } = pageData;
  return (
    <Fragment>
      <Toolbar>
        <Grid container alignItems="center" className={classes.rightWrap}>
          <Hidden xsDown>
            <Grid item md={12} lg={12}>
              <Hidden mdDown>
                <Box className={classes.tags}>
                  {menu?.slice(0, 8)?.map((tabMenu, index) => (
                    <Box
                      key={index}
                      position="relative"
                      onMouseEnter={(event) => {
                        setMenuActive(tabMenu);
                      }}
                      onMouseLeave={(event) => {
                        if (event.pageY < 73) {
                          setMenuActive(false);
                        }
                      }}
                    >
                      <Button
                        className={
                          menuActive?.customer_segment ===
                          tabMenu?.customer_segment
                            ? classes.buttonActive
                            : classes.buttonInactive
                        }
                      >
                        <Box display="flex" flexDirection="column">
                          <Typography className={classes.tabText}>
                            {tabMenu.customer_segment}
                          </Typography>
                          <Typography className={classes.tabSubText}>
                            {tabMenu.customer_segment_dtl}
                          </Typography>
                        </Box>
                      </Button>
                    </Box>
                  ))}
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
      zIndex: 3,
    },
  },
  tabText: {
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "19px",
    color: "white",
  },
  tabSubText: {
    fontSize: "10px",
    fontWeight: 400,
    lineHeight: "12px",
    textAlign: "center",
    color: "white",
  },
  buttonInactive: {
    margin: theme.spacing(0, 2),
    padding: theme.spacing(1.5),
    color: "white",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    textTransform: "none!important",
    [theme.breakpoints.down("xs")]: {
      margin: 0,
    },
  },
  buttonActive: {
    margin: theme.spacing(0, 2),
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    textTransform: "none",
    borderBottom: "5px solid white",
    transition: "none",
    [theme.breakpoints.down("xs")]: {
      margin: 0,
    },
  },
  rightWrap: {
    display: "flex",
    justifyContent: "flex-end",
  },
  tags: {
    display: "flex",
    flexDirection: "row",
  },
  divider: {
    height: "5px",
    backgroundColor: "white",
    position: "absolute",
    bottom: "-14px",
    width: "100%",
  },
}));

export default MenuBar;
