import { ElementDivider, BundleBox } from "@ktwebsite/components";
import { Box, Container, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import "@builder.io/widgets";
// import { builder, BuilderComponent } from '@builder.io/react';
import configDev from "@ktwebsite/utils/config/config.dev";
import {
  BannerCarousel,
  FlashSale,
  ShopByAge,
  WeeklyBest,
  Accessory,
  CustomerReviews,
  StainlessSteelCollection,
} from "./components";
const useStyles = makeStyles((theme) => ({
  root: {},
}));

// builder.init(configDev.builderio_api_key);

const Landing = (props) => {
  const { children, className, ...rest } = props;
  const classes = useStyles();
  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      {/* <BuilderComponent
        model="page"
        entry={configDev.builderio_landing_page}
       />
      <ElementDivider /> */}
      <BannerCarousel />
      <Container maxWidth="lg">
        <WeeklyBest />
        <FlashSale />
      </Container>
      <ShopByAge />
      <Container maxWidth="lg">
        <StainlessSteelCollection />
      </Container>
      <BundleBox />
      <Accessory />
      <CustomerReviews />
    </Box>
  );
};

export default Landing;
