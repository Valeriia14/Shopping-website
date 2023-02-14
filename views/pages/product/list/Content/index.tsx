import {
  BundleAndSave,
  CharacterSliderElement,
  ElementDivider,
  NavBreadcrumbs,
  PageElements,
  ProductList,
  NotFoundPage,
} from "@ktwebsite/components";
import { usePageData, usePageElements } from "@ktwebsite/hooks";
import theme from "@ktwebsite/theme";
import { Box, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: "26px",
    lineHeight: "39px",
    fontWeight: "normal",
    marginBottom: "22px",
  },
  paragraph: {
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0.444444px",
    maxWidth: "800px",
    margin: "auto",
  },
  contentSpacer: {
    margin: "0px 0px 60px",
    [theme.breakpoints.down("sm")]: {
      margin: "0px 0px 45px",
    },
  },
});

export default (props: any) => {
  const character = usePageData((data) => data.character);
  const products = usePageData(data => data.products ?? []);
  const elements = usePageElements();
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {character ? (
        <React.Fragment>
          <Container maxWidth="lg">
            <BundleAndSave />
            <NavBreadcrumbs
              firstTitle="Home"
              firstLink="/"
              finalTitle={character?.name ?? "Products"}
            />
            <Box className={classes.contentSpacer}>
              <Typography align="center" className={classes.heading}>
                Kidztime Official Licensed Merchandise
              </Typography>
              <Typography align="center" className={classes.paragraph}>
                From Marel to Minions, we have partner with all major licensed
                character to bring kiddo’s favourite superheroes to life! Browse
                our full range of licensed merchanidse.
              </Typography>
            </Box>
          </Container>
          <ElementDivider />
          <CharacterSliderElement />
          <ProductList products={products}/>
          <ElementDivider />
          <PageElements elements={elements} />
        </React.Fragment>
      ) : (
        <Container maxWidth="lg">
          <BundleAndSave />
          <NavBreadcrumbs
            firstTitle="Home"
            firstLink="/"
          />
          <NotFoundPage title="Oops!Can not found this character." />
        </Container>
      )}
    </Box>
  );
};
