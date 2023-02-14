import { AccountDashboardHeader, AccountDashboardLayout } from "@ktwebsite/components";
import { Box, Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import ContactForm from "./components/ContactForm";
import FaqText from "./components/FaqText";

const useStyles = makeStyles((theme) => ({
  root: {
  },
  faqWrap: {
    marginLeft: theme.spacing(3)
  }
}));

export default (props: any) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Container maxWidth="xl" disableGutters>
        <AccountDashboardLayout selected="contactUs">
          <AccountDashboardHeader titleText="CONTACT US &amp; FAQ" subTitleText="CONTACT FORM" />
          <ContactForm />
          <AccountDashboardHeader titleText="" subTitleText="FREQUENTLY ASKED QUESTIONS" />
          <Grid container item xs={11} className={classes.faqWrap}>
            <FaqText title="Can i do a refund or exchange for products bought online?"
              body="Yes you can! We are able to do both refunds and replacements within 7 days of the delivery date as long as the product is new and unused. Please contact us directly" />
            <FaqText title="Items that are damaged after 7 days of the delivery"
              body="Unfortunately for items received after 7 days of delivery, we are not able to provide any exchanges unless the damage is due to manufacturing defects. Please contact us direct anyway and we will see how we can assist" />
            <FaqText title="I bought the items from a retail shop or retailer and i would like to exchange or return"
              body="Unfortunately for items bought from our retail and distribution partner, we are unable to provide any exchange or return. Our advice would be to bring back the merchadise to whichever retailer that you have purchased it from along with your receipt. The return policy would be based on those of the retailer." />
            <FaqText title="How do I get my free straw replacement?"
              body="To get the free straw replacement, simply login to your account and select the ‘Kidztime Benefit’ link that is listed under our customer support. From there, you just got to fill up a simple form and voila! A free straw would be on the way to your doorsteps." />
          </Grid>
        </AccountDashboardLayout>
      </Container>
    </Box>
  );
}
