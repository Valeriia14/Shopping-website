import { useCart, useNote } from "@ktwebsite/hooks";
import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Hidden,
  Radio,
  RadioGroup,
  Typography,
  makeStyles,
  Grow,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import theme from "@ktwebsite/theme";
import {
  CreateNewAddressForm,
  PickUpTab,
  ShipOutTab,
  VoucherDialog,
  EditAddressChoice,
} from "./components";
import {
  CheckoutStepper,
  OrderSummaryWidget,
  StickyActionBox,
  StickyHeaderBox,
  BaseButton,
} from "@ktwebsite/components";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import { formStructure } from "./formConfig";
import useApi from "@ktwebsite/utils/api/useApi";
import doRedirect from "@ktwebsite/utils/doRedirect";
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
    fontSize: "34px",
    color: theme.palette.primary.main,
    marginLeft: 16,
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5%",
      fontSize: "32px",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "0%",
      fontSize: "26px",
      marginTop: 8,
      marginBottom: 30,
    },
  },
  shippingMethodGrid: {
    padding: "0px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginTop: 90,
    },
  },
  shippingMethodBox: {
    marginTop: 36,
    margin: 16,
    [theme.breakpoints.down("xs")]: {
      margin: "16px 0px",
    },
  },
  nextStepButton: {
    minWidth: 150,
    height: 48,
    marginLeft: 16,
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
      minWidth: "auto",
      width: "100%",
      margin: 0,
    },
  },
  textStepButton: {
    color: "white!important",
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "19px",
    textAlign: "center",
  },
  baseInput: {
    padding: "0",
    margin: "8px 0",
  },
  formControl: {
    width: "100%",
  },
  formControlLabel: {
    backgroundColor: "#F9F8F4",
    height: "60px",
    margin: 0,
    border: "1px solid #E3E3E3",
    width: "100%",
    "& .MuiRadio-root": {
      padding: "17px!important",
    },
  },
  formControlLabelActive: {
    backgroundColor: "#F9F8F4",
    height: "60px",
    margin: 0,
    border: "1px solid",
    width: "100%",
    "& .MuiRadio-root": {
      padding: "17px!important",
    },
  },
  tabBox: {
    padding: "30px 50px",
    borderLeft: "1px solid",
    borderBottom: "1px solid",
    borderRight: "1px solid",
    marginBottom: "14px",
    [theme.breakpoints.down("xs")]: {
      padding: "24px 20px",
    },
  },
  iconImage: {
    width: "24px",
    marginRight: 14,
  },
  tabLabelBox: {
    display: "flex",
    alignItems: "center",
    marginLeft: 14,
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
  },
  tabLabelTypography: {
    textTransform: "uppercase",
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: "19px",
    textAlign: "left",
    [theme.breakpoints.down("xs")]: {
      fontSize: "14px",
    },
  },
}));

const ShippingMethodBoby = (props) => {
  const classes = useStyles();
  const [cart, setCart] = useCart();
  const api = useApi();
  const [getAddresses, loading] = useAsyncTask("getAddresses");
  const [value, setValue] = React.useState(0);
  const [isSelectAddress, setIsSelectAddress] = React.useState(false);
  const [editSelection, setEditSelection] = React.useState(false);
  const [openCreateAddress, setOpenCreateAddress] = useState(false);
  const [reload, setReload] = useState(false);
  const [methodActive, setMethodActive] = React.useState("standard");
  const [name, setName] = useState("");
  const [addressList, setAddressList] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const addressSelected =
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("addressSelected"))
      : null;

  const handleNextStep = useCallback(() => {
    if ((addressSelected?.id && value === 0) || value === 1) {
      sessionStorage.setItem("tabActive", value);
      doRedirect("/checkout_payment");
    } else if (!addressSelected?.id && value === 0) {
      enqueueSnackbar("You need to choose your shipping address first !", {
        variant: "error",
      });
    }
  }, [addressList, methodActive, value, addressSelected]);

  useEffect(() => {
    getAddresses(async () => {
      const sessionToken = localStorage.getItem("sessionToken");
      if (sessionToken) {
        const response = await api.path("account/address/list").get({
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
        const res = response.data.result ? response.data.result.model : [];
        const addressSelected = res?.filter((item) => item?.shipping_default);
        if (addressSelected.length > 0) {
          setIsSelectAddress(true);
          sessionStorage.setItem(
            "addressSelected",
            JSON.stringify(addressSelected[0])
          );
        } else {
          sessionStorage.setItem("addressSelected", JSON.stringify({}));
        }
        setAddressList(res);
      }
    });
  }, [reload]);

  useEffect(() => {
    sessionStorage.removeItem("shippingFee");
    sessionStorage.setItem("tabActive", 0);
  }, []);

  useEffect(() => {
    if (editSelection) {
      if (openCreateAddress) {
        setName("ADD NEW ADDRESS");
      } else {
        setName("Change/Add");
      }
    } else if (!editSelection) {
      if (openCreateAddress) {
        setName("ADD NEW ADDRESS");
      } else {
        setName("shipping");
      }
    }
  }, [editSelection, openCreateAddress]);

  const handleChange = (event) => {
    setValue(parseInt(event.target.value, 10));
  };

  const [showVoucherDialog, setShowVoucherDialog] = useState(false);

  const handleClickOpen = () => {
    setShowVoucherDialog(true);
  };
  const PrimaryRadio = withStyles({
    root: {
      color: "#ccc",
      "&$checked": {
        color: theme.palette.primary.main,
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);

  return (
    <>
      <Hidden smUp={true}>
        <StickyHeaderBox name={name} backPath="/cart" />
      </Hidden>
      <Box mb={5} display="flex" justifyContent="center" alignItems="center">
        <Grid container item className={classes.cartGrid}>
          <Grid item md={8} sm={12} className={classes.shippingMethodGrid}>
            <Hidden xsDown={true}>
              <Box>
                <CheckoutStepper
                  steps={["BAG", "SHIPPING", "PAYMENT"]}
                  activeStep={1}
                />
              </Box>
              <Box>
                <Typography variant="h1" className={classes.cartHeaderText}>
                  CHOOSE SHIPPING METHOD
                </Typography>
              </Box>
            </Hidden>
            {!openCreateAddress && !editSelection && (
              <Fragment>
                <Hidden smUp={true}>
                  <Box>
                    <CheckoutStepper
                      steps={["BAG", "SHIPPING", "PAYMENT"]}
                      activeStep={1}
                    />
                  </Box>
                  <Box>
                    <Typography variant="h1" className={classes.cartHeaderText}>
                      CHOOSE SHIPPING METHOD
                    </Typography>
                  </Box>
                </Hidden>
                <Box className={classes.shippingMethodBox}>
                  <FormControl
                    className={classes.formControl}
                    component="fieldset"
                  >
                    <RadioGroup value={value} onChange={handleChange}>
                      <Box mb={2}>
                        <FormControlLabel
                          className={
                            value === 0
                              ? classes.formControlLabelActive
                              : classes.formControlLabel
                          }
                          value={0}
                          onClick={() => {
                            setReload((prev) => !prev);
                          }}
                          control={<PrimaryRadio />}
                          label={
                            <Box className={classes.tabLabelBox}>
                              <img
                                src="/images/truck.svg"
                                className={classes.iconImage}
                                alt="truck"
                              />
                              <Typography
                                className={classes.tabLabelTypography}
                              >
                                Get it delivered to your doorstep
                              </Typography>
                            </Box>
                          }
                        />
                        {value === 0 && (
                          <Box className={classes.tabBox}>
                            <ShipOutTab
                              openCreateAddress={openCreateAddress}
                              setOpenCreateAddress={setOpenCreateAddress}
                              methodActive={methodActive}
                              setMethodActive={setMethodActive}
                              isSelectAddress={isSelectAddress}
                              addressList={addressList}
                              setAddressList={setAddressList}
                              editSelection={editSelection}
                              setEditSelection={setEditSelection}
                            />
                          </Box>
                        )}
                      </Box>
                      <Box mb={3}>
                        <FormControlLabel
                          value={1}
                          className={
                            value === 1
                              ? classes.formControlLabelActive
                              : classes.formControlLabel
                          }
                          control={<PrimaryRadio />}
                          label={
                            <Box className={classes.tabLabelBox}>
                              <img
                                src="/images/self_collection_icon.svg"
                                className={classes.iconImage}
                                alt="truck"
                              />
                              <Typography
                                className={classes.tabLabelTypography}
                              >
                                Self collection
                              </Typography>
                            </Box>
                          }
                        />
                        {value === 1 && (
                          <Box className={classes.tabBox}>
                            <PickUpTab
                              methodActive={methodActive}
                              setMethodActive={setMethodActive}
                            />
                          </Box>
                        )}
                      </Box>
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Fragment>
            )}
            {!openCreateAddress && editSelection && (
              <EditAddressChoice
                setOpenCreateAddress={setOpenCreateAddress}
                addressList={addressList}
                setAddressList={setAddressList}
                setEditSelection={setEditSelection}
                setIsSelectAddress={setIsSelectAddress}
                setReload={setReload}
              />
            )}
            {openCreateAddress && (
              <Grow in={openCreateAddress}>
                <CreateNewAddressForm
                  setOpenCreateAddress={setOpenCreateAddress}
                  setReload={setReload}
                />
              </Grow>
            )}
            {!editSelection && !openCreateAddress && (
              <Hidden xsDown={true}>
                <Box display="flex" justifyContent="flex-start">
                  <BaseButton
                    onClick={handleNextStep}
                    disabled={!addressSelected?.id && value === 0}
                    buttonClassName={classes.nextStepButton}
                    text="CONTINUE TO PAYMENT"
                    textClassName={classes.textStepButton}
                  />
                </Box>
              </Hidden>
            )}
            <Hidden smUp={true}>
              <StickyActionBox>
                <BaseButton
                  onClick={handleNextStep}
                  disabled={!addressSelected?.id && value === 0}
                  buttonClassName={classes.nextStepButton}
                  text="CONTINUE TO PAYMENT"
                  textClassName={classes.textStepButton}
                />
              </StickyActionBox>
            </Hidden>
          </Grid>
          <Hidden xsDown={true}>
            <Grid item md={4} sm={12}>
              <Box margin="16px">
                <OrderSummaryWidget
                  disabled={true}
                  order={cart}
                  discount={cart?.discount}
                  tabActive={value}
                />
              </Box>
            </Grid>
          </Hidden>
        </Grid>
      </Box>

      <VoucherDialog
        open={showVoucherDialog}
        onClose={() => setShowVoucherDialog(false)}
      />
    </>
  );
};

export default ShippingMethodBoby;
