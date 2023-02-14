import {
  Box,
  Grid,
  Typography,
  Snackbar,
  Checkbox,
  FormControlLabel,
  List,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect, useCallback } from "react";
import { BaseInput } from "@ktwebsite/components";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import useApi from "@ktwebsite/utils/api/useApi";
import useStripe from "@ktwebsite/utils/api/useStripe";
import { ServerErrors } from "@ktwebsite/utils/constants";
import snakeToTitle from "@ktwebsite/utils/snakeToTitle";
import OrderSummary from "../OrderSummary";
import ProductList from "../ProductList";
import { formStructure } from "./ShippingDetailConfig.js";
import queryString from "query-string";
import doRedirect from "@ktwebsite/utils/doRedirect";
import CreditCardBox from "./CreditCardBox";
import moment from "moment";
import configDev from "@ktwebsite/utils/config/config.dev";
import jwt from "jwt-decode";
import cookie from "cookie";

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
      marginLeft: "2.5%",
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
  boxList: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  root: {
    width: "100%",
    position: "relative",
    overflow: "auto",
    maxHeight: 400,
  },
}));

const monthToCorrectNumber = (month) => ("0" + month).substr(-2);

const CheckOutBody = (props) => {
  const classes = useStyles({});
  const [fields, values, errors] = useFormHandler(formStructure);
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
  const [exchangeInItem, setExchangeInItem] = useState([]);
  const [exchangeOutItem, setExchangeOutItem] = useState([]);
  useEffect(() => {
    if (typeof getOrderDetails !== "function") {
      return;
    }
    getOrderDetails(async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const response = await api
        .path("order/detail_summary", { reference: jwt(token).order_ref })
        .get();
      const detail = response.data.result.model
        ? response.data.result.model
        : [];
      sessionStorage.setItem("reference", detail?.reference);
      sessionStorage.setItem("order_id_exchanging", detail.id);
      const exchangeIn = detail.order_items.filter(
        (e) => e.status === "exchange-in"
      );
      const exchangeOut = detail.order_items.filter(
        (e) => e.status === "exchange-out"
      );
      setExchangeInItem(exchangeIn);
      setExchangeOutItem(exchangeOut);
      const newCart = {
        old_order_total: Number(
          Math.round((detail.subtotal - jwt(token).amount) * 10) / 10
        ),
        new_order_total: Number(detail.subtotal),
        receipt_difference: Number(Math.round(jwt(token).amount * 10) / 10),
        additional_shipping_fee: Number(detail.additional_shipping),
        order_total_difference: Number(
          Math.round((jwt(token).amount + detail.additional_shipping) * 10) / 10
        ),
      };
      setCartSummary(newCart);
    });
  }, []);

  useEffect(() => {
    if (typeof getPaymentMethod !== "function") {
      return;
    }
    const cookies = cookie.parse(document.cookie);
    const sessionToken = cookies?.authorization;
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
      });
    }
  }, []);

  const handleSubmit = (event) => {
    event && event.preventDefault();
    if (errors === undefined) {
      setLoadingCheckouts(true);
      if (!selectedCard) {
        runStripeToken(async () => {
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
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const { email } = values;

      try {
        let response = null;
        const body = {
          email: email,
          save: checkSave,
          token: token,
        };
        if (res && res.data) {
          body["stripe_token"] = res.data.id;
        }
        if (selectedCard?.id) {
          body["payment_method_id"] = selectedCard.id;
        }
        response = await api.path("public/resolve_exchange").post({
          body,
        });
        if (response) {
          setLoadingCheckouts(false);
          const order_id = sessionStorage.getItem("order_id_exchanging");
          document.cookie = `order_id=; expires=${moment().format()}; path=/;`;
          doRedirect("/order/" + order_id + "/summary");
          sessionStorage.removeItem("order_id_exchanging");
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
          </Box>
          <Grid container item xs={11} className={classes.contactWrap}>
            <Box className={classes.boxList}>
              <Typography variant="h2" className={classes.cartSubHeaderText}>
                Exchange products detail
              </Typography>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Grid container item spacing={4} className={classes.cartGrid}>
                  <Grid item md={12} sm={12} className={classes.productGrid}>
                    <List className={classes.root} subheader={<li />}>
                      {exchangeOutItem.map((itemOut, index) => (
                        <React.Fragment key={`asd${index}`}>
                          <ProductList item={exchangeInItem[index]} />
                          <ProductList item={itemOut} />
                        </React.Fragment>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </Box>
            </Box>
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
                {!selectedCard && (
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
              <Grid item sm={6} xs={12} className={classes.AccountContactRight}>
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
