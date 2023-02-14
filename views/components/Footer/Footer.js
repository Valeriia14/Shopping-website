import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  OutlinedInput,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { usePageData } from "@ktwebsite/hooks";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  footerContainer: {
    padding: "100px 0px",
    background: "#DEDCD0",
    [theme.breakpoints.down("sm")]: {
      padding: "50px 0px",
    },
  },
  primaryContentBox: {
    [theme.breakpoints.up("lg")]: {
      borderTop: "1px solid",
      borderBottom: "1px solid",
    },
  },
  container: {
    padding: 0,
  },
  contactUsBox: {
    height: "100%",
    padding: "150px 0px 50px 0px",
    [theme.breakpoints.down("md")]: {
      borderTop: "1px solid",
      margin: "0",
      padding: "33px 0px 46px 0px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },
  midBox: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingBottom: "50px",
    [theme.breakpoints.up("lg")]: {
      borderLeft: "1px solid",
      borderRight: "1px solid",
    },
    [theme.breakpoints.down("md")]: {
      borderTop: "1px solid",
      borderBottom: "1px solid",
      padding: "38px 0px 46px 0px",
    },
  },
  smallText: {
    fontSize: "14px",
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
    },
  },
  mediumText: {
    fontSize: "16px",
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
    },
    [theme.breakpoints.down("sm")]: {
      textAlign: "left",
    },
  },
  bottomText: {
    [theme.breakpoints.down("sm")]: {
      textAlign: "left !important",
      marginLeft: "34px",
    },
  },
  boldText: {
    fontSize: "20px",
    fontWeight: "700",
  },
  kidztimeTextImg: {
    marginBottom: "30px",
  },
  contactUsText: {
    marginBottom: "30px",
  },
  footerBottom: {
    padding: "100px 0px",
    [theme.breakpoints.down("md")]: {
      padding: "50px 0px 50px 0px",
    },
  },
  whatsappNumberInput: {
    borderRadius: "0px",
    width: "100%",
    height: "45px",
    fontSize: "14px",
    fontWeight: "500",
    "& input": {
      padding: "10px 14px",
      borderRadius: "0px",
    },
  },
  whatsappNumberSubscribeBox: {
    height: "100%",
    display: "flex",
    alignItems: "flex-end",
    paddingBottom: "50px",
    [theme.breakpoints.down("md")]: {
      borderBottom: "1px solid",
      justifyContent: "center",
      padding: "30px 34px !important",
      marginBottom: "42px",
    },
  },

  whatsappNumberSubscribeContainer: {
    [theme.breakpoints.up("lg")]: {
      paddingLeft: "100px",
    },
  },
  whatsappNumberInputNotchedOutline: {
    border: "none",
    borderBottom: "1px solid",
  },
  whatsappNumberInputOutlineInput: {
    padding: "0px !important",
    position: "relative",
    top: "5px",
  },
  whatsappNumberInputSubmit: {
    background: "black",
    color: "white",
    borderRadius: "0px",
    height: "45px",
    marginLeft: "10px",
    padding: "0px 45px",
    "&:hover": {
      background: "black",
    },
  },
  inputLabelText: {
    position: "absolute",
    fontSize: "10px",
  },
}));

const Footer = (props) => {
  const classes = useStyles();
  const pageData = usePageData();
  const settingsObj = pageData?.settings?.reduce((prev, current) => {
    prev[current.value] = current;
    return prev;
  }, {});

  return (
    <Box className={classes.footerContainer}>
      <Box className={classes.primaryContentBox}>
        <Container className={classes.container} maxWidth="lg">
          <Grid container spacing={0}>
            <Grid item lg={3} xs={12}>
              <Box className={classes.contactUsBox}>
                <Typography
                  className={clsx(classes.boldText, classes.contactUsText)}
                >
                  Contact Us
                </Typography>
                <Typography className={classes.smallText}>
                  Hotline : 12345678
                </Typography>
                <Typography className={classes.smallText}>
                  Whatsapp : 12345678
                </Typography>
                <Typography className={classes.smallText}>
                  Email : enquiry@kidztime.com
                </Typography>
              </Box>
            </Grid>
            <Grid item lg={4} xs={12}>
              <Box className={classes.midBox}>
                <Box display="flex" alignItems="center" flexDirection="column">
                  {/* <Hidden mdDown={true}> */}
                  <img
                    src={"/images/kidztime-boutique-round.png"}
                    className={classes.kidztimeTextImg}
                  />
                  {/* </Hidden> */}
                  {/* <Hidden lgUp={true}>
                    <Typography
                      className={clsx(classes.boldText, classes.contactUsText)}
                    >
                      Our Office Location
                    </Typography>
                  </Hidden> */}
                  <Typography className={classes.smallText}>
                    Vendermac Distribution Pte Ltd
                  </Typography>
                  <Typography className={classes.smallText}>
                    159 Sin Ming Rd, Singapore 575625
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} lg={5}>
              <Box className={classes.whatsappNumberSubscribeBox}>
                <Box className={classes.whatsappNumberSubscribeContainer}>
                  <Typography className={classes.mediumText}>
                    Fresh arrivals, new and new-to-you brands, and expert edits.
                    Basically, a bundle of joy send through your whatsapp.
                  </Typography>

                  <Box display="flex" mt={3}>
                    <Typography className={classes.inputLabelText}>
                      Whatsapp Number
                    </Typography>
                    <OutlinedInput
                      id="customer-whatsapp-number"
                      className={classes.whatsappNumberInput}
                      classes={{
                        notchedOutline:
                          classes.whatsappNumberInputNotchedOutline,
                        input: classes.whatsappNumberInputOutlineInput,
                      }}
                    />
                    <Button className={classes.whatsappNumberInputSubmit}>
                      GO
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box className={classes.footerBottom}>
        <Container className={classes.container} maxWidth="lg">
          <Typography className={clsx(classes.smallText, classes.bottomText)}>
            © kidztime.com 2021
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
