import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Hidden,
  makeStyles,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { CommonInput, StickyActionBox } from "@ktwebsite/components";
import { formStructure } from "./configForm";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import DoneIcon from "@material-ui/icons/Done";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";
import useStripe from "@ktwebsite/utils/api/useStripe";
import useApi from "@ktwebsite/utils/api/useApi";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import queryString from "query-string";
import configDev from "@ktwebsite/utils/config/config.dev";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  headerText: {
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: "19px",
    textAlign: "left",
    textTransform: "uppercase",
  },
  methodImg: {
    marginLeft: theme.spacing(1),
    width: 60,
  },
  paymentMethodText: {
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: "20px",
    textAlign: "left",
    marginRight: theme.spacing(2),
  },
  formControl: {},
  formGroup: {
    flexDirection: "row",
  },
  buttonBox: {
    display: "flex",
    marginTop: 16,
    [theme.breakpoints.down("sm")]: {
      margin: "16px 0",
      justifyContent: "space-between",
    },
  },
  cancelButton: {
    minWidth: 270,
    height: 48,
    fontSize: "18px",
    fontFamily: "Barlow-medium",
    borderRadius: 0,
    border: "1px solid black",
    marginRight: 16,
    padding: "8px 48px",
    [theme.breakpoints.down("xs")]: {
      minWidth: 150,
      padding: "8px 16px",
      margin: 0,
    },
  },
  saveButton: {
    minWidth: 270,
    marginRight: 16,
    height: 48,
    fontSize: "18px",
    fontFamily: "Barlow-medium",
    borderRadius: 0,
    color: "white",
    backgroundColor: "black",
    padding: "8px 48px",
    "&:hover": {
      backgroundColor: "black",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "8px 16px",
      minWidth: 150,
      margin: 0,
    },
  },
  icon: {
    color: "#1E3A3A!important",
  },
  normalText: {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "14px",
    textAlign: "left",
  },
  divider: {
    margin: "50px 0px 30px 0px ",
    [theme.breakpoints.down("xs")]: {
      margin: "0px 0px 30px 0px ",
    },
  },
  imageBox: {
    display: "flex",
    [theme.breakpoints.up("sm")]: {
      alignItems: "center",
      justifyContent: "center",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "24px",
      marginBottom: "16px",
      alignItems: "center",
    },
  },
}));

const PaymentForm = (props) => {
  const { setPaymentEdit, setReload, paymentList } = props;
  const classes = useStyles();
  const [runStripeToken, loadingStripeToken, errorStripeToken] =
    useAsyncTask("createToken");
  const [createPayment, loading, error] = useAsyncTask("createPayment");
  const [fields, values, errors, setValues] = useFormHandler(formStructure);
  const stripeApi = useStripe();
  const api = useApi();
  const { enqueueSnackbar } = useSnackbar();
  const [defaultPayment, setDefaultPayment] = React.useState(
    paymentList?.length > 0 ? false : true
  );

  const CheckboxCustom = (props) => {
    return (
      <Checkbox
        {...props}
        classes={{
          root: classes.inputRoot,
          checked: classes.checked,
        }}
        className={classes.checkBox}
        icon={<CheckBoxOutlineBlankOutlinedIcon className={classes.icon} />}
        checkedIcon={<CheckBoxOutlinedIcon className={classes.icon} />}
      />
    );
  };

  const handleChangeDefault = (event) => {
    setDefaultPayment(event.target.checked);
  };

  const handleSubmit = () => {
    runStripeToken(async () => {
      try {
        const { card_number, expiry_date, cvc_cvv } = values;
        const exp_month = expiry_date.substring(0, 2);
        const exp_year = expiry_date.slice(2);
        const details = queryString.stringify({
          "card[number]": card_number,
          "card[exp_month]": exp_month,
          "card[exp_year]": `20${exp_year}`,
          "card[cvc]": cvc_cvv,
        });
        const response = await stripeApi.path("cart/stripeToken").multipost({
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${configDev.publicKey}`,
          },
          body: details,
        });
        if (response) {
          createPayment(async () => {
            try {
              const body = {
                stripe_token: response?.data?.id,
                set_default_payment: defaultPayment,
              };
              const res = await api
                .path("account/payment/create")
                .post({ body });
              setReload((prev) => !prev);
              enqueueSnackbar("Created a new payment method successfully!", {
                variant: "success",
              });
              localStorage.removeItem("editPayment");
              setPaymentEdit(false);
            } catch (error) {
              enqueueSnackbar(error.message, { variant: "error" });
            }
          });
        }
      } catch (errorStripeToken) {
        enqueueSnackbar(errorStripeToken.message, { variant: "error" });
      }
    });
  };

  return (
    <Box>
      <Typography className={classes.headerText}>
        Select payment method
      </Typography>
      <Box>
        <RadioGroup>
          <FormControlLabel
            value="card"
            control={<Radio checked={true} color="primary" />}
            label={
              <Box display="flex" alignItems="center" margin="16px 0px">
                <Typography className={classes.paymentMethodText}>
                  Secured payment by credit card
                </Typography>
                <Hidden xsDown>
                  <Box className={classes.imageBox}>
                    <img
                      src="/images/AMEX_img.svg"
                      className={classes.methodImg}
                      alt="AMEX_img"
                    />
                    <img
                      src="/images/VISA_img.svg"
                      className={classes.methodImg}
                      alt="VISA_img"
                    />
                    <img
                      src="/images/MASTER_img.svg"
                      className={classes.methodImg}
                      alt="MASTER_img"
                    />
                  </Box>
                </Hidden>
              </Box>
            }
          />
          <Hidden smUp>
            <Box className={classes.imageBox}>
              <img
                src="/images/AMEX_img.svg"
                className={classes.methodImg}
                alt="AMEX_img"
              />
              <img
                src="/images/VISA_img.svg"
                className={classes.methodImg}
                alt="VISA_img"
              />
              <img
                src="/images/MASTER_img.svg"
                className={classes.methodImg}
                alt="MASTER_img"
              />
            </Box>
          </Hidden>
          <CommonInput fields={fields} />
          <FormControl component="fieldset" className={classes.formControl}>
            <FormGroup className={classes.formGroup}>
              <FormControlLabel
                control={
                  <CheckboxCustom
                    color="primary"
                    checked={defaultPayment}
                    onChange={handleChangeDefault}
                    name="defaultPaymentMethod"
                  />
                }
                label={
                  <Box margin="24px 0px">
                    <Typography className={classes.normalText}>
                      Set this card as default payment
                    </Typography>
                  </Box>
                }
              />
            </FormGroup>
          </FormControl>
          <Hidden xsDown={true}>
            <Box className={classes.buttonBox}>
              <Button
                className={classes.cancelButton}
                onClick={() => {
                  localStorage.removeItem("editPayment");
                  setPaymentEdit(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} className={classes.saveButton}>
                SAVE
              </Button>
            </Box>
          </Hidden>
          <Hidden smUp={true}>
            <Box className={classes.buttonBox}>
              <StickyActionBox zIndex={5}>
                <Button
                  className={classes.cancelButton}
                  onClick={() => {
                    localStorage.removeItem("editPayment");
                    setPaymentEdit(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className={classes.saveButton}>
                  SAVE
                </Button>
              </StickyActionBox>
            </Box>
          </Hidden>
          <Divider className={classes.divider} />
          <FormControlLabel
            value="paypal"
            control={<Radio color="primary" />}
            label={
              <Box display="flex" alignItems="center" margin="16px 0px">
                <Typography className={classes.paymentMethodText}>
                  Paypal
                </Typography>
                <img
                  src="/images/PAYPAL_img.png"
                  alt="PAYPAL_img"
                  className={classes.methodImg}
                />
              </Box>
            }
          />
        </RadioGroup>
      </Box>
    </Box>
  );
};

export default PaymentForm;
