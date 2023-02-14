import { usePageData } from "@ktwebsite/hooks";
import { Box, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

const useStyles = makeStyles((theme) => ({
  textHeader: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "37px",
    textAlign: "left",
    marginRight: "16px",
  },
  textSub: {
    fontSize: "10px",
    fontWeight: 600,
    textAlign: "center",
    background: "#F9F8F4",
    borderRadius: "10px",
    padding: "4px 10px",
  },
}));

const MenuTabs = (props) => {
  const { setViewItem } = props;
  const classes = useStyles();
  const pageData = usePageData();
  const { menu } = pageData;
  return (
    <Box p="30px 30px 40px 30px">
      {menu?.map((tabMenu, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={1}
          onClick={() => {
            setViewItem(tabMenu);
          }}
        >
          <Box display="flex" alignItems="center">
            <Typography className={classes.textHeader}>
              {tabMenu.customer_segment}
            </Typography>
            <Typography className={classes.textSub}>
              {tabMenu.customer_segment_dtl}
            </Typography>
          </Box>
          <ArrowForwardIosIcon fontSize="small"/>
        </Box>
      ))}
    </Box>
  );
};

export default MenuTabs;
