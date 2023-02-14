import {
  Box,
  Grid,
  Typography,
  Snackbar,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import { BaseInput } from "@ktwebsite/components";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import useApi from "@ktwebsite/utils/api/useApi";
import useStripe from "@ktwebsite/utils/api/useStripe";
import { ServerErrors } from "@ktwebsite/utils/constants";
import snakeToTitle from "@ktwebsite/utils/snakeToTitle";
import OrderSummary from "../OrderSummary";
import { formStructure } from "./ShippingDetailConfig.js";
import queryString from "query-string";
import doRedirect from "@ktwebsite/utils/doRedirect";
import CreditCardBox from "./CreditCardBox";
import moment from "moment";
import cookie from "cookie";
import configDev from "@ktwebsite/utils/config/config.dev";

const useStyles = makeStyles((theme) => ({
  cartGrid: {
    [theme.breakpoints.down("sm")]: {
      padding: "none",
      width: "100%",
      margin: "0px",
    },
  },
  cartHeaderText: {
    fontSize: "48px",
    color: theme.palette.primary.main,
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5%",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "0%",
    },
  },
  cartSubHeaderText: {
    fontSize: "24px",
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5%",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "0%",
    },
  },
  cartBundleSubTitle: {
    fontSize: "24px",
    color: theme.palette.primary.main,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5%",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "0%",
    },
  },
  productGrid: {
    padding: "0px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  summaryGrid: {
    padding: "0px",
  },
  contactWrap: {
    marginLeft: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing(1.5),
    },
  },
  AccountContactLeft: {
    paddingRight: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      paddingRight: theme.spacing(0),
    },
  },
  AccountContactRight: {
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      paddingLeft: theme.spacing(0),
    },
  },
  creditCardImage: {
    width: "70%",
    marginTop: "65px",
    marginLeft: "50px",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  subHeaderText: {
    fontSize: "24px",
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5%",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "0%",
    },
  },
  cvcField: {
    width: "100px",
  },
  saveCardCheckbox: {
    fontSize: "14px",
    marginBottom: "8px",
  },
  emptyCardContainer: {
    borderRadius: "10px",
    border: "1px solid #8FA5BB",
    width: "255px",
    height: "160px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCardItems: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  emptyCardImage: {
    marginTop: "5px",
  },
  emptyCardComment: {
    color: "#8FA5BB",
    margin: "5px 0 0 0",
  },
}));

const monthToCorrectNumber = (month) => ("0" + month).substr(-2);

const CheckOutBody = (props) => {
  const classes = useStyles({});
  const [fields, values, errors ,setValues] = useFormHandler(formStructure);
  const api = useApi();
  const stripeApi = useStripe();
  const [runStripeToken, loadingStripeToken, errorStripeToken] =
    useAsyncTask("createToken");
  const [runCheckOut, loadingCheckOut, errorCheckOut] =
    useAsyncTask("runCheckOut");
  const [getPaymentMethod, loadingPaymentMethod, errorPaymentMethod] =
    useAsyncTask("getPaymentMethod");
  const [getOrderDetails, getOrderDetailLoading, getOrderDetailError] =
    useAsyncTask("getOrderDetails");

  const [submitError, setSubmitError] = useState(false); //?
  const [errorMessage, setErrorMessage] = useState(); //?
  const [snackOpen, setSnackOpen] = useState(false); //?
  const [loadingCheckout, setLoadingCheckouts] = useState(false); //?

  const [paymentData, setPaymentData] = useState([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    promoCodeDiscount: 0,
    pointsDiscount: 0,
    shippingFee: 0,
    total: 0,
  });
  const [checkSave, setCheckSave] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [hasCards, setHasCards] = useState(false);
  const [paymentButtonDisabled, setPaymentButtonDisabled] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof getOrderDetails !== "function") {
      return;
    }

    const cookies = cookie.parse(document?.cookie);
    const order_id = cookies?.order_id;
    const sessionToken = localStorage.getItem("sessionToken");

    if (order_id || sessionToken) {
      getOrderDetails(async () => {
        const response = await api.path("order/detail", { order_id }).get();
        const detail = response.data.result.model
          ? response.data.result.model
          : [];
        if (detail?.reference) {
          sessionStorage.setItem("reference", detail?.reference);
          sessionStorage.setItem("order_id", detail?.id);
        }
        const newCart = {
          subtotal: Number(detail.subtotal),
          promoCodeDiscount: Number(detail.discount),
          pointsDiscount: Number(detail.points_discount),
          shippingFee: Number(detail.shipping),
          total: Number(detail.total),
        };
        setCartSummary(newCart);
      });
    }
  }, []);

  useEffect(() => {
    if (typeof getPaymentMethod !== "function") {
      return;
    }
    const sessionToken = localStorage.getItem("sessionToken");
    setToken(sessionToken);
    if (sessionToken) {
      getPaymentMethod(async () => {
        const response = await api.path("account/payment").get({
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
        const res = response.data.result ? response.data.result.model : [];
        const cardInfo = Boolean(response.data.result.model);
        setPaymentData(res);
        setHasCards(cardInfo);
        reloadProfile(sessionToken);
      });
    }
  }, []);
  const reloadProfile = async (sessionToken) => {
    const response = await api.path("account/profile").get({
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    let profileRes = response.data.result ? response.data.result : {};
    let initialState = Object.keys(formStructure).reduce((acc, key) => {
      switch (key) {
        case "first_name":
          acc["first_name"] = profileRes["firstname"];
          return acc;
        case "last_name":
          acc["last_name"] = profileRes["lastname"];
          return acc;
        case "email":
          acc["email"] = profileRes["email_address"];
          return acc;
        default:
          acc[key] = formStructure[key].initialValue || profileRes[key];
          return acc;
      }
    }, {});
    setValues(initialState);
  };
  const handleSubmit = (event) => {
    event && event.preventDefault();
    if (errors === undefined) {
      if (!selectedCard) {
        runStripeToken(async () => {
          setLoadingCheckouts(true);
          const { card_number, expiry, cvc } = values;
          const exp_month = expiry.substring(0, 2);
          const exp_year = expiry.substring(3);
          const details = queryString.stringify({
            "card[number]": card_number,
            "card[exp_month]": exp_month,
            "card[exp_year]": exp_year,
            "card[cvc]": cvc,
          });
          try {
            const response = await stripeApi
              .path("cart/stripeToken")
              .multipost({
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Authorization: `Bearer ${configDev.publicKey}`,
                },
                body: details,
              });
            if (response) {
              checkout(response);
            }
          } catch (errorStripeToken) {
            setLoadingCheckouts(false);
            setSnackOpen(!!errorStripeToken);
            setErrorMessage(
              ServerErrors[errorStripeToken.message] ||
                snakeToTitle(errorStripeToken.message)
            );
          }
        });
      } else {
        checkout();
      }
    } else {
      setSubmitError(errors);
      setSnackOpen(true);
      setErrorMessage("You need to fill in all required fields!");
    }
  };

  const checkout = (res) => {
    runCheckOut(async () => {
      const cookies = cookie.parse(document.cookie);
      const order_id = cookies?.order_id || sessionStorage.getItem("order_id");
      let sessionToken = localStorage.getItem("sessionToken");

      const { email } = values;
      try {
        let response = null;
        const toPoints = cartSummary.pointsDiscount * 10;
        let customer = {
          customer_name: values.first_name + " " + values.last_name,
          postal_code: values.postal_code,
          customer_email: values.email,
          shipping_address: values.delivery_address,
          phone_number: values.phone_number,
          notes: values.notes_to_seller,
        };
        const body = {
          email: email,
          points: Number(toPoints),
          save: checkSave,
          customer : customer,
        };
        if (res && res.data) {
          body["stripe_token"] = res.data.id;
        }
        if (selectedCard?.id) {
          body["payment_method_id"] = selectedCard.id;
        }
        response = await api
          .path("public/checkout", { order_id: order_id })
          .post({
            ...(sessionToken &
              {
                headers: {
                  Authorization: `Bearer ${sessionToken}`,
                },
              }),
            body,
          });
        if (response.status===200) {
          setLoadingCheckouts(false);
          doRedirect("/order/" + order_id + "/summary");
          sessionStorage.removeItem("order_id");
          document.cookie = `order_id=; expires=${moment().format()}; path=/;`;
        }
      } catch (errorCheckout) {
        setLoadingCheckouts(false);
        setSnackOpen(!!errorCheckout);
        setErrorMessage(
          ServerErrors[errorCheckout.message] ||
            snakeToTitle(errorCheckout.message)
        );
      }
    });
  };

  const selectCard = (val) => {
    values.card_number = `**** **** **** ${val.extra1}`;
    const month = monthToCorrectNumber(val.extra2);
    values.expiry = `${month}/${val.extra3}`;
    setSelectedCard(val);
    setIsInputDisabled(true);
  };

  const handleSaveChange = () => {
    setCheckSave(!checkSave);
  };

  return (
    <Box mb={5} display="flex" justifyContent="center" alignItems="center">
      <Grid
        container
        item
        lg={11}
        md={12}
        spacing={8}
        className={classes.cartGrid}
      >
        <Grid item md={7} sm={12} className={classes.productGrid}>
          <Box>
            <Typography variant="h1" className={classes.cartHeaderText}>
              CHECKOUT
            </Typography>
            <Typography variant="h2" className={classes.cartSubHeaderText}>
              Shipping details
            </Typography>
          </Box>

          <Grid container item xs={11} className={classes.contactWrap}>
            <Grid container item xs={12}>
              <Grid item sm={6} xs={12} className={classes.AccountContactLeft}>
                <BaseInput
                  fields={fields}
                  name="first_name"
                  type="text"
                  required
                  submitError={submitError}
                />
              </Grid>
              <Grid item sm={6} xs={12} className={classes.AccountContactRight}>
                <BaseInput
                  fields={fields}
                  name="last_name"
                  type="text"
                  required
                  submitError={submitError}
                />
              </Grid>
              <Grid item sm={6} xs={12} className={classes.AccountContactLeft}>
                <BaseInput
                  fields={fields}
                  name="email"
                  type="text"
                  required
                  submitError={submitError}
                />
              </Grid>
              <Grid item sm={6} xs={12} className={classes.AccountContactRight}>
                <BaseInput
                  fields={fields}
                  name="delivery_address"
                  type="text"
                  required
                  submitError={submitError}
                />
              </Grid>
              <Grid item sm={6} xs={12} className={classes.AccountContactLeft}>
                <BaseInput
                  fields={fields}
                  name="phone_number"
                  type="number"
                  required
                  submitError={submitError}
                />
              </Grid>
              <Grid item sm={6} xs={12} className={classes.AccountContactRight}>
                <BaseInput
                  fields={fields}
                  name="postal_code"
                  type="text"
                  required
                  submitError={submitError}
                />
              </Grid>
              <Grid item xs={12}>
                <BaseInput
                  fields={fields}
                  name="notes_to_seller"
                  type="text"
                  multiline={true}
                  rows={5}
                />
              </Grid>
            </Grid>
            <Grid container item xs={12}>
              <Grid item sm={6} xs={12} className={classes.AccountContactLeft}>
                <Typography variant="h2" className={classes.subHeaderText}>
                  Payment Details
                </Typography>
                <BaseInput
                  fields={fields}
                  name="name_on_card"
                  type="text"
                  required
                  submitError={submitError}
                />
                <BaseInput
                  fields={fields}
                  name="card_number"
                  type="number"
                  required
                  submitError={submitError}
                  disabled={isInputDisabled}
                />
                <BaseInput
                  fields={fields}
                  name="expiry"
                  type="text"
                  required
                  submitError={submitError}
                  disabled={isInputDisabled}
                />
                <BaseInput
                  fields={fields}
                  name="cvc"
                  type="number"
                  required
                  className={classes.cvcField}
                  submitError={submitError}
                />
                <BaseInput
                  fields={fields}
                  name="Primary_billing_address"
                  type="text"
                  required
                  multiline={true}
                  rows={5}
                  submitError={submitError}
                />
                {!selectedCard && token && (
                  <FormControlLabel
                    disabled={paymentButtonDisabled}
                    control={
                      <Checkbox
                        checked={checkSave}
                        onChange={handleSaveChange}
                        name="saveCard"
                        color="primary"
                        className={classes.saveCardCheckbox}
                      />
                    }
                    label="Save card for future payment?"
                  />
                )}
              </Grid>
              {token && (
                <Grid
                  item
                  sm={6}
                  xs={12}
                  className={classes.AccountContactRight}
                >
                  <Typography variant="h2" className={classes.subHeaderText}>
                    Saved Cards
                  </Typography>
                  {hasCards ? (
                    <CreditCardBox
                      paymentData={paymentData}
                      selectCard={selectCard}
                    />
                  ) : (
                    <div className={classes.emptyCardContainer}>
                      <div className={classes.emptyCardItems}>
                        <img
                          src="/images/card-grey.svg"
                          className={classes.emptyCardImage}
                        />
                        <p className={classes.emptyCardComment}>
                          You have no saved cards
                        </p>
                      </div>
                    </div>
                  )}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={5} sm={12} xs={12} className={classes.summaryGrid}>
          <OrderSummary
            onProceed={() => handleSubmit()}
            loading={loadingCheckout}
            cartSummary={cartSummary}
            disabled={paymentButtonDisabled}
          />
        </Grid>
      </Grid>
      <Snackbar
        key={errorStripeToken}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        message={errorStripeToken || errorMessage}
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
      />
    </Box>
  );
};

export default CheckOutBody;
