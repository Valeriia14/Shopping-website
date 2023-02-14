import {
  BannerCarousel,
  ContactBox,
  NavBreadcrumbs,
  NotFoundPage,
} from "@ktwebsite/components";
import { usePageData } from "@ktwebsite/hooks";
import pascalize from "@ktwebsite/utils/fomatting/pascalize";
import { Box, Container, Hidden } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useMemo } from "react";
import { ProductListBody, Header } from "./Components";

const useStyles = makeStyles((theme) => ({
  root: {},
  contenBox: {
    marginTop: 72,
    [theme.breakpoints.down("xs")]: {
      marginTop: 30,
    },
  },
}));

export default (props: any) => {
  const classes = useStyles();
  const product_type = usePageData((data) => data.product_type);
  const win = typeof window === "undefined" ? undefined : window;

  const feature_banner = useMemo(() => {
    const assets = product_type?.webpage?.items[0]?.assets ?? [];
    let elements = product_type?.webpage?.items[0]?.options?.feature_banner;
    return elements?.map((e: any) => {
      return {
        ...e,
        img_desk: assets?.filter((asset: any) => asset?.id === e?.img_desk)[0]
          ?.uri,
        img_mob: assets?.filter((asset: any) => asset?.id === e?.img_mob)[0]
          ?.uri,
      };
    });
  }, [product_type]);

  return (
    <Box className={classes.root}>
      <BannerCarousel element={feature_banner} />
      <Header/>
      <Container maxWidth="lg">
        <Hidden>
          <Box mt={2}>
            <NavBreadcrumbs
              firstTitle="Home"
              firstLink="/"
              finalTitle={product_type?.name ?? pascalize(win?.location?.pathname.slice(11))}
            />
          </Box>
        </Hidden>
        {product_type ? (
          <Box className={classes.contenBox}>
            <ProductListBody />
          </Box>
        ) : (
          <NotFoundPage title="Oops!Can not found this product type." />
        )}
      </Container>
      <ContactBox />
    </Box>
  );
};
