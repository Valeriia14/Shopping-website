import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback } from "react";
import { Stepper, Step, StepLabel, Box } from "@material-ui/core";
import doRedirect from "@ktwebsite/utils/doRedirect";

const useStyles = makeStyles((theme) => ({
  checkoutStepper: {
    padding:"24px 80px",
    [theme.breakpoints.down("xs")]: {
      padding: "0px",
      marginBottom: theme.spacing(3),
    },
    marginBottom: theme.spacing(1),
    "& .MuiStep-alternativeLabel": {
      flex: 1,
      position: "relative",
      display: "flex",
      justifyContent: "center",
      "& .MuiStepConnector-alternativeLabel":{
        left: "calc(-50% + 12px)",
        right: "calc(50% + 12px)"
      }
    },
    "& .MuiStepConnector-root": {
      backgroundColor: "#1E3A3A",
      height: "2px",
    },
  },
  alternativeLabel: {
    marginTop: "0px !important",
    "& .MuiStepLabel-labelContainer": {
      marginTop: theme.spacing(1),
    },
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      display: "inherit",
    },
    "& div": {
      fontSize: 16,
      color: "#1E3A3A",
      fontWeight: "bold",
      [theme.breakpoints.down("xs")]:{
        fontSize: 14,
      }
    },
    "& .MuiStepIcon-root":{
      color: "white",
      border: "1px  solid #1E3A3A",
      borderRadius: 25,
      "&.MuiStepIcon-completed":{
        color: "#1E3A3A!important",
        border: "none!important",
      },
      "&.MuiStepIcon-active":{
        color: "#1E3A3A!important",
        border: "none!important",
        "& .MuiStepIcon-text":{
          fill: "white!important"
        }
      },
      "& .MuiStepIcon-text":{
        fill: "#1E3A3A"
      }
    }
  },
  cursor: {
    cursor: "pointer",
  },
  icon: {
    margin: "0px 6px",
    [theme.breakpoints.down("xs")]:{
      height: "18px"
    }
  },
}));

const CheckoutStepper = (props) => {
  const { steps, activeStep } = props;
  const classes = useStyles();

  const handleStep = useCallback(
    (label, index) => {
      if (index < activeStep) {
        switch (label) {
          case "BAG":
            doRedirect("/cart");
            break;
          default:
            doRedirect("/shipping_method");
            break;
        }
      }
    },
    [activeStep]
  );

  const getIcon = (label) => {
    let icon = "";
    switch (label) {
      case "BAG":
        icon = (
          <Box><img src="/images/Shopping_cart_icon_border.svg" className={classes.icon} /></Box>
        );
        break;
      case "SHIPPING":
        icon = (
          <img src="/images/Free_shipping_icon.svg" className={classes.icon} />
        );
        break;
      case "PAYMENT":
        icon = <img src="/images/Payment_method_icon.svg" className={classes.icon} />;
        break;
      default:
        icon = "";
        break;
    }
    return icon;
  };

  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep}
      className={classes.checkoutStepper}
    >
      {steps.map((label, index) => (
        <Step
          onClick={() => handleStep(label, index)}
          key={label}
          className={index < activeStep ? classes.cursor : ""}
        >
          <StepLabel
            classes={{
              alternativeLabel: classes.alternativeLabel,
            }}
          >
              {getIcon(label)}
              <Box>{label}</Box>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CheckoutStepper;
