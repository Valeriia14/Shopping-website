import {
  Box,
  Grid,
  Typography,
  Snackbar,
  Checkbox,
  FormControlLabel,
  Radio,
  Hidden,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect, Fragment } from "react";
import { BaseInput, OrderSummaryWidget, BaseButton, CheckoutStepper, StickyHeaderBox, StickyActionBox, CommonInput } from "@ktwebsite/components";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import useApi from "@ktwebsite/utils/api/useApi";
import useStripe from "@ktwebsite/utils/api/useStripe";
import { ServerErrors } from "@ktwebsite/utils/constants";
import snakeToTitle from "@ktwebsite/utils/snakeToTitle";
import { formStructure } from "./ShippingDetailConfig.js";
import queryString from "query-string";
import doRedirect from "@ktwebsite/utils/doRedirect";
import CreditCardBox from "./CreditCardBox";
import moment from "moment";
import cookie from "cookie";
import configDev from "@ktwebsite/utils/config/config.dev";
import  ShipOutTab from "../ShipOutTab";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  cartGrid: {
    [theme.breakpoints.down("sm")]: {
      padding: "none",
      width: "100%",
      margin: "0px",
    },
  },
  cartHeaderText: {
    fontSize: "20px",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  primaryTitle :{
    fontSize: "30px",
    color: "#000000",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5%",
      fontSize: "20px",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "0%",
      fontSize: "20px",
      marginTop: 8,
      textAlign: "center",
    },
  },
  cartSubHeaderText: {
    fontSize: "16px",
    fontWeight: "700px",
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(2),
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
    [theme.breakpoints.down("xs")]: {
      padding: "0px !important",
      width: "100%",
      marginTop: 90,
      marginBottom: 100,
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
  paymentMethodContainer: {
    width: "100%",
  },
  paymentInfoInput: {
    width: "100%",
  },
  fieldBox: {
  },
  agreement: {
    fontSize: "10px",
    fontWeight: "500",
    color: "#1E3A3A",
    padding: theme.spacing(1,0),
    marginBottom: "50px"
  },
  checkoutBtn: {
    marginTop: "50px",
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    background: "black",
    height: "48px",
    borderRadius: "0px",
    "&:hover": {
      background: "#128051"
    },
    [theme.breakpoints.down("xs")]: {
      minWidth: 250,
      margin: 0,
    },
  },
  checkoutBtnText: {
    fontSize: "18px",
    color: "#fff",
    fontWeight: 500
  },
  paymentMethodRadioLabel: {
    fontSize: "14px",
    fontWeight: "500",
  },
  inputRoot: {
    fontSize: "14px",
    color: "black",
    "&$checked": {
      color: "black"
    }
  },
  checked: {},
  hr: {
    color: "#BDBDBD",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  methodImg: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  inputBox: {
    margin:"23px 0px",
    [theme.breakpoints.down("xs")]: {
      flexWrap: "wrap"
    },
    "& p":{
      fontWeight: "bold",
      fontSize: "16px",
      paddingRight: "30px"
    }
  },
  mobileOrderSummary: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  subTitle :{
    marginBottom: "30px",
    marginTop: "8px",
    fontSize: "16px"
  },
  formControlLabel :{
    padding: "30px 0px 0px"
  }
}));

const monthToCorrectNumber = (month) => ("0" + month).substr(-2);


const CheckOutBody = (props) => {
  const classes = useStyles({});
  const [fields, values, errors ,setValues ,clearForm ,setErrors , setDirtys] = useFormHandler(formStructure);

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
  const { enqueueSnackbar } = useSnackbar();

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
  const [method, setMethod] = useState('card');
  const [createPayment, loading, error] = useAsyncTask("createPayment");
  const [openCreateAddress, setOpenCreateAddress] = useState(false);
  const [reload, setReload] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [editSelection, setEditSelection] = useState(false);
  const [isSelectAddress, setIsSelectAddress] = useState(false);
  const [getBillingAddresses] = useAsyncTask("getBillingAddresses");
  useEffect(() => {
    if (typeof getOrderDetails !== "function" || typeof getBillingAddresses !== "function") {
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
      getBillingAddresses(async () => {
          const response = await api.path("account/billing_address/list").get();
          const res = response.data.result ? response.data.result.model : [];
          if(!isSelectAddress && res.length){
            const billingAddressSelected = res?.filter((item) => item?.billing_default);
            if (billingAddressSelected.length > 0) {
              setIsSelectAddress(true);
              sessionStorage.setItem(
                "billingAddressSelected",
                JSON.stringify(billingAddressSelected[0])
              );
            } else {
              sessionStorage.setItem("billingAddressSelected", JSON.stringify({}));
            }
          }
          setAddressList(res);
      });
    }
  }, [reload]);

  // useEffect(() => {
  //   if (typeof getPaymentMethod !== "function") {
  //     return;
  //   }
  //   const sessionToken = localStorage.getItem("sessionToken");
  //   setToken(sessionToken);
  //   if (sessionToken) {
  //     getPaymentMethod(async () => {
  //       const response = await api.path("account/payment").get({
  //         headers: {
  //           Authorization: `Bearer ${sessionToken}`,
  //         },
  //       });
  //       const res = response.data.result ? response.data.result.model : [];
  //       const cardInfo = Boolean(response.data.result.model);
  //       setPaymentData(res);
  //       setHasCards(cardInfo);
  //       // reloadProfile(sessionToken);
  //     });
  //   }
  // }, []);
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
          const { card_number, cardholder_name, expiry_date,cvc_cvv } = values;
          const exp_month = expiry_date.substring(0, 2);
          const exp_year = expiry_date.substring(2,4);
          const details = queryString.stringify({
            "card[number]": card_number,
            "card[exp_month]": exp_month,
            "card[exp_year]": exp_year,
            "card[cvc]": cvc_cvv,
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
              if(checkSave){
                createPayment(async () => {
                  try {
                    const body = {
                      stripe_token: response?.data?.id,
                      set_default_payment: false,
                    };
                    const res = await api
                      .path("account/payment/create")
                      .post({ body });
                  } catch (error) {
                    setSnackOpen(true);
                    setErrorMessage(error.message);
                  }
                });
              }

              const cartData = sessionStorage.getItem("cart") ? JSON.parse(sessionStorage.getItem("cart")) : null;
              // const shippingFee = sessionStorage.getItem("shippingFee") ? parseInt(sessionStorage.getItem("shippingFee")) : 0;

              const shippingAddress = sessionStorage.getItem("addressSelected") ? JSON.parse(sessionStorage.getItem("addressSelected")) : null;
              const billingAddress = sessionStorage.getItem("billingAddressSelected") ? JSON.parse(sessionStorage.getItem("billingAddressSelected")) : null;
              const note = sessionStorage.getItem("note") ? JSON.parse(sessionStorage.getItem("note")) : null;

              const checkoutData = {
                cart : cartData,
                stripeToken: response.data.id,
                shippingAddress: shippingAddress,
                billingAddress: billingAddress,
                note : note
              }
              checkout(checkoutData);
            }
          } catch (errorStripeToken) {
            setLoadingCheckouts(false);
            enqueueSnackbar(errorStripeToken.message, {
              variant: "error",
            });
          }
        });
      } else {
         // checkout();
      }
    } else {
      setDirtys(errors);
      enqueueSnackbar(
        "You need to fill in all required fields!",
        { variant: "error" }
      );
    }
  };

  const checkout = (body) => {
    runCheckOut(async () => {
      let sessionToken = localStorage.getItem("sessionToken");
      if(body?.billingAddress?.id){
        try {
          let response = await api
            .path("public/checkout")
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
            doRedirect("/order/" + response.data.result.order_id + "/summary");
          }
        } catch (errorCheckout) {
          setLoadingCheckouts(false);
          setSnackOpen(!!errorCheckout);
          setErrorMessage(
            ServerErrors[errorCheckout.message] ||
              snakeToTitle(errorCheckout.message)
          );
        }
      } else {
        enqueueSnackbar(
          "You need to choose your billing address first !",
          { variant: "error" }
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
    <>
      <Hidden smUp={true}>
        <StickyHeaderBox name="payment" backPath="/shipping_method" />
      </Hidden>
      <Box mt={28} mb={5} display="flex" justifyContent="center" alignItems="center">

        <Grid container item spacing={4} className={classes.cartGrid}>
          <Grid item md={8} sm={12} className={classes.productGrid}>
            <Box>
              <CheckoutStepper steps={['BAG', 'SHIPPING', 'PAYMENT']} activeStep={2}/>
            </Box>

            <Hidden mdUp>
              <Grid item md={4} sm={12} className={classes.mobileOrderSummary}>
                <OrderSummaryWidget disabled={true} summaryCollapse={true} />
              </Grid>
            </Hidden>

            <Box>
              <Typography variant="h2" className={classes.primaryTitle}>
                CHOOSE PAYMENT METHOD
              </Typography>
              <Typography variant="h5" className={classes.subTitle}>
                All transaction are secured and encrypted
              </Typography>
            </Box>



            <Box className={classes.paymentMethodContainer}>
              <Typography variant="h1" className={classes.cartHeaderText}>
              Secured payment by credit card
              </Typography>

              <Box display="flex" alignItems="center" className={classes.inputBox}>
                <Typography > We accept various cards </Typography>
                <img src="/images/AMEX_img.svg" className={classes.methodImg}/>
                <img src="/images/VISA_img.svg" className={classes.methodImg}/>
                <img src="/images/MASTER_img.svg" className={classes.methodImg}/>
              </Box>
              <CommonInput fields={fields}/>

              <FormControlLabel
                disabled={paymentButtonDisabled}
                className={classes.formControlLabel}
                control={
                  <Checkbox
                    checked={checkSave}
                    onChange={handleSaveChange}
                    name="saveCard"
                    classes={{
                      root: classes.inputRoot,
                      checked: classes.checked,
                    }}
                    className={classes.saveCardCheckbox}
                  />
                }
                classes={{
                  label: classes.paymentMethodRadioLabel,
                }}
                label="Save this card for future payment"
              />

              <Typography variant="h4" className={classes.agreement}>
                ​By placing your order you agree to our Terms and Conditions and Return Policy. You also consent to some of your data being processed by Kidztime in accordance with the terms of the Privacy Policy, which may be used to make future shopping experience better for you.​
              </Typography>
              <ShipOutTab
                  openCreateAddress={openCreateAddress || !addressList.length}
                  setOpenCreateAddress={setOpenCreateAddress}
                  isSelectAddress={isSelectAddress}
                  addressList={addressList}
                  setAddressList={setAddressList}
                  editSelection={editSelection}
                  setEditSelection={setEditSelection}
                  setReload={setReload}
                  setIsSelectAddress={setIsSelectAddress}
                  handleCheckout ={handleSubmit}
                />
              {(!openCreateAddress && addressList.length) ? (
                <Fragment>
                  <Hidden xsDown={true}>
                  <BaseButton
                    text="PAY NOW"
                    disabled={false}
                    buttonClassName={classes.checkoutBtn}
                    textClassName={classes.checkoutBtnText} onClick={() => handleSubmit()}
                  />
                  </Hidden>
                  <Hidden smUp={true}>
                  <StickyActionBox>
                    <BaseButton
                      text="PAY NOW"
                      disabled={false}
                      buttonClassName={classes.checkoutBtn}
                      textClassName={classes.checkoutBtnText} onClick={() => handleSubmit()}
                    />
                  </StickyActionBox>
                  </Hidden>
                </Fragment>
              ) : ""}
            </Box>


          </Grid>

          <Hidden smDown>
            <Grid item md={4} sm={12}>
              <OrderSummaryWidget disabled={true} />
            </Grid>
          </Hidden>

        </Grid>
      </Box>
    </>
  );
};

export default CheckOutBody;
