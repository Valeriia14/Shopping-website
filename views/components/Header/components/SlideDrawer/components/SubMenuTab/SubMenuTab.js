import { Box, Divider, makeStyles, Slide, Typography } from "@material-ui/core";
import React, { useState } from "react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import doRedirect from "@ktwebsite/utils/doRedirect";

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
  icon: {
    marginRight: "8px",
  },
  divider: {
    backgroundColor: "black",
  },
}));

const SubMenuTab = (props) => {
  const { viewsItem, setViewItem } = props;
  const [viewSubBodyTab, setViewSubBodyTab] = useState(false);
  const classes = useStyles();
  return (
    <>
      {!viewSubBodyTab && (
        <Slide direction="right" in={!viewSubBodyTab}>
          <Box>
            <Box display="flex" alignItems="center" p="20px">
              <ArrowBackIosIcon
                fontSize="small"
                className={classes.icon}
                onClick={() => {
                  setViewItem(false);
                }}
              />
              <Typography className={classes.textHeader}>
                {viewsItem.customer_segment}
              </Typography>
              <Typography className={classes.textSub}>
                {viewsItem.customer_segment_dtl}
              </Typography>
            </Box>
            <Divider className={classes.divider} />
            <Box p="30px 30px 40px 30px">
              {viewsItem?.sub_menu?.map((item, index) => {
                return (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    pb={1}
                    onClick={() => {
                      setViewSubBodyTab(item?.sub_header);
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <Typography className={classes.textHeader}>
                        {item.sub_header.label}
                      </Typography>
                    </Box>
                    <ArrowForwardIosIcon fontSize="small"/>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Slide>
      )}
      {viewSubBodyTab && (
        <Slide direction="left" in={!!viewSubBodyTab}>
          <Box>
            <Box display="flex" alignItems="center" p="20px">
              <ArrowBackIosIcon
                fontSize="small"
                className={classes.icon}
                onClick={() => {
                  setViewSubBodyTab(false);
                }}
              />
              <Typography className={classes.textHeader}>
                {viewSubBodyTab?.label}
              </Typography>
            </Box>
            <Divider className={classes.divider} />
            <Box p="30px 30px 40px 30px">
              {viewSubBodyTab?.sub_body?.map((item, index) => {
                return (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    pb={1}
                    onClick={() => {
                      doRedirect(`/product-type/${item.handle}`)
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <Typography className={classes.textHeader}>
                        {item?.name}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Slide>
      )}
    </>
  );
};

export default SubMenuTab;
