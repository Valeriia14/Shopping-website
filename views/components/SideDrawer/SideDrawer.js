import { Box, Drawer, ListItem, ListItemText, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import React, { useState } from "react";
import ActionSection from "./components/ActionSection";
import SeeAllButton from "./components/SeeAllButton";
import SliderWrapper from "./components/SliderWrapper";
import BaseLoader from "../BaseLoader";

const imgArray = ["/images/bag_to_school.svg", "/images/dinnerwares.svg", "/images/water_bottles.svg", "/images/school_accessories.svg", "/images/sales.svg", "/images/redemption-brand.svg"];
const labelsArray = ["Bag to School", "Dinnerwares", "Water Bottles", "School Accessories", "Sales", "Brand Characters"];
const sideBarImgArray = ["/images/sidebar/bags/full-day-backpack.png", "/images/sidebar/bags/half-day-backpack.png", "/images/sidebar/bags/half-day-lite-backpack.png"];
const sideBarImgLabelArray = ["Full-Day Backpack", "Half-Day Backpack", "Half-Day Lite Backpack"];

const useStyles = makeStyles((theme) => ({
  root: {

  },
  icon: {
    color: theme.palette.primary.main,
    width: "28px",
    height: "28px",
    marginRight: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      width: "20px",
      height: "20px",
    },
  },
  listingText: {
    fontSize: "18px",
    fontWeight: 600,
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
    },
  },
  listingRightIcon: {
    fontSize: "24px",
  },
  backIcon: {
    float: "left",
    margin: theme.spacing(2, 0, 2, 2),
  },
  itemHeaderWrap: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2, 5, 2, 0),
  },
  itemHeaderText: {
    fontSize: "16px",
    fontWeight: 600,
    textTransform: "uppercase",
    marginLeft: theme.spacing(2),
  },
  contentWrap: {
    padding: theme.spacing(2),
    marginRight: theme.spacing(5),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    [theme.breakpoints.down("xs")]: {
      width: 265,
    },
  },
  sideImgWrap: {
    display: "flex",
    flexDirection: "column",
    width: 100,
    height: 150,
    marginBottom: theme.spacing(2)
  },
  sideImg: {
    width: 100,
    height: 90,
  },
  sideDrawerText: {
    fontSize: "14px",
    width: "100%",
    textAlign: "center"
  },

}));

const SideDrawer = props => {
  const { onClose, open } = props;
  const classes = useStyles();
  const [viewItem, setViewItem] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleList = (item) => {
    setViewItem(item);
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose} className={classes.root} disableEnforceFocus>
      {!viewItem && (
        <SliderWrapper direction="right" slideIn={!viewItem} onClick={onClose}>
          <ListItem button onClick={onClose}>
            <img src="/images/home.svg" className={classes.icon} />
            <ListItemText primary={<Typography className={classes.listingText}>Home</Typography>} />
          </ListItem>
          {labelsArray.map((text, index) => (
            <ListItem button key={text} onClick={() => toggleList(text)}>
              <img src={imgArray[index]} className={classes.icon} />
              <ListItemText primary={<Typography className={classes.listingText}>{text}</Typography>} />
              <ArrowRightIcon className={classes.listingRightIcon} />
            </ListItem>
          ))}
        </SliderWrapper>)}

      {!!viewItem && (
        <SliderWrapper direction="left" slideIn={!!viewItem}>
          <Box onClick={() => toggleList(false)}>
            <ArrowLeftIcon className={classes.backIcon} />
            <Box className={classes.itemHeaderWrap}>
              <img src={imgArray[labelsArray.indexOf(viewItem)]} />
              <Typography className={classes.itemHeaderText}>{viewItem}</Typography>
            </Box>
          </Box>
          {loading && <BaseLoader />}
          <Box className={classes.contentWrap}>
            {sideBarImgLabelArray.map((text, index) => (
              <Box key={text} className={classes.sideImgWrap}>
                <img src={sideBarImgArray[index]} className={classes.sideImg} />
                <Typography className={classes.sideDrawerText}>{text}</Typography>
              </Box>
            ))}
            <SeeAllButton onClick={() => console.log("onClick See all")} />
          </Box>
        </SliderWrapper>)}
      <ActionSection />
    </Drawer>
  );
}

export default SideDrawer;