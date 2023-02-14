
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box, Accordion, AccordionSummary, AccordionDetails, Link } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  accordionBox: {
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  accordion: {
    border: "none",
    boxShadow: "none",
    borderBottom: "1px solid #ccc",
  },
  accordionTitleBox: {
    borderLeft: "4px solid #2e2965",
  },
  accordionTitle: {
    color: "#000"
  },
  accordionDetail: {
    flexDirection: "column"
  },
  accordionText: {
    marginBottom: theme.spacing(2),
    color: "#4396c5"
  },
}));

const FooterAccordion = props => {
  const classes = useStyles();

  return (
    <Box className={classes.accordionBox}>
      <Accordion className={classes.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <Box pl={1} ml={-1.7} className={classes.accordionTitleBox}>
            <Typography variant="h3" className={classes.accordionTitle}>CUSTOMER SUPPORT</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetail}>
          <Link href="#" underline="none">
            <Typography variant="h4" className={classes.accordionText}>
              Account &amp; Order History
          </Typography>
          </Link>
          <Link href="#" underline="none">
            <Typography variant="h4" className={classes.accordionText}>
              Kidztime SMILES Rewards
          </Typography>
          </Link>
          <Link href="#" underline="none">
            <Typography variant="h4" className={classes.accordionText}>
              Contact Us &amp; FAQ
          </Typography>
          </Link>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header">
          <Box pl={1} ml={-1.7} className={classes.accordionTitleBox}>
            <Typography variant="h3" className={classes.accordionTitle}>CONTACT US</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetail}>
          <Typography variant="h4" className={classes.accordionText}>
            Tel: +65 6553 3133
          </Typography>
          <Typography variant="h4" className={classes.accordionText}>
            Email: Enquiry@kidztime.com
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header">
          <Box pl={1} ml={-1.7} className={classes.accordionTitleBox}>
            <Typography variant="h3" className={classes.accordionTitle}>SHOP WITH US</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetail}>
          <Link href="#" underline="none">
            <Typography variant="h4" className={classes.accordionText}>
              Water Bottles
          </Typography>
          </Link>
          <Link href="#" underline="none">
            <Typography variant="h4" className={classes.accordionText}>
              Dinnerwares
          </Typography>
          </Link>
          <Link href="#" underline="none">
            <Typography variant="h4" className={classes.accordionText}>
              School Bags
          </Typography>
          </Link>
          <Link href="#" underline="none">
            <Typography variant="h4" className={classes.accordionText}>
              Accessories &amp; Gears
          </Typography>
          </Link>
          <Link href="#" underline="none">
            <Typography variant="h4" className={classes.accordionText}>
              Sales &amp; Clearance
          </Typography>
          </Link>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FooterAccordion;
