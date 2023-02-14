import { Box, Typography, Grid, Hidden } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment, useEffect, useState } from "react";
import { useSelfAccount } from "@ktwebsite/hooks";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { ValidateCardCredit } from "@ktwebsite/components";
import useApi from "@ktwebsite/utils/api/useApi";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import BoxDashboard from "./BoxDashboard";
import CardWishlist from "./CardWishlist";
import RowDashboard from "./RowDashboard";

const useStyles = makeStyles((theme) => ({
  buttonBox: {
    backgroundColor: "#000000",
    color: "white",
    borderRadius: "unset",
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    width: "200px",
    height: "50px",
    padding: 0,
  },
  root: {
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "19px",
    marginTop: theme.spacing(7),
    marginBottom: theme.spacing(4),
  },
  pointText: {
    color: "black",
    fontWeight: "bold",
    fontSize: "16px",
    lineHeight: "28px",
  },
  box: {
    padding: "0 !important",
    height: "270px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: theme.spacing(5),
    border: "1px solid red",
  },
  icon: {
    width: "60px",
    height: "42px",
    paddingRight: theme.spacing(1),
  },
  iconText: {
    padding: theme.spacing(2, 1, 1),
    fontWeight: "bold",
    fontSize: "16px",
  },
  title: {
    fontWeight: "bold",
    fontSize: "20px",
    display: "flex",
    alignItems: "center",
    "& > img": {
      width: "20px",
      maxHeight: "20px",
      objectFit: "contain",
      marginRight: "5px",
    },
  },
  divider: {
    margin: theme.spacing(2, 0, 2.5),
    backgroundColor: "#000",
    height: "2px",
    border: "none",
    width: "100%",
  },
}));

const AccountDetailForm = () => {
  const classes = useStyles({});
  const self = useSelfAccount();
  const api = useApi();
  const [getAddresses, loading, error] = useAsyncTask("getAddresses");
  const [getPaymentMethods] = useAsyncTask("getPaymentMethods");
  const [payment, setPayment] = useState(null);
  const [address, setAddress] = useState(null);

  const getDetail = () => {
    getAddresses(async () => {
      const response = await api.path("account/address/list").get();

      const res = response.data.result ? response.data.result.model : [];
      console.log("res:", res);
      const data = self.shipping_default_id
        ? res.find((i) => i.id == self.shipping_default_id)
        : null;
      setAddress(data);
    });
    getPaymentMethods(async () => {
      const response = await api.path("account/payment").get();
      const res = response.data.result ? response.data.result.model : [];
      const data = self.payment_method_default_id
        ? res.find((i) => i.id == self.payment_method_default_id)
        : null;
      setPayment(data);
    });
  };
  useEffect(() => {
    getDetail();
  }, []);

  const redirect = (path) => () => doRedirect(path);

  return (
    <>
      <Hidden xsDown>
        <Box className={classes.root} mt={2} width="100%">
          <Grid container spacing={7}>
            <BoxDashboard
              title="WISHLIST (3)"
              iconTitleSrc="/images/Wishlist_icon.svg"
              onRedirect={redirect("/account/wishlist")}
              buttonText="VIEW WISHLIST"
              center
            >
              <CardWishlist
                onRedirect={() => {}}
                imgSrc="/images/image-attachment.png"
              />
              <CardWishlist
                onRedirect={() => {}}
                imgSrc="/images/image-attachment.png"
              />
              <CardWishlist
                onRedirect={() => {}}
                imgSrc="/images/image-attachment.png"
              />
              <CardWishlist onRedirect={() => {}} noMargin text="+ More" />
            </BoxDashboard>
            <BoxDashboard
              title="PROFILE"
              iconTitleSrc="/images/file_icon.svg"
              onRedirect={redirect("/account/profile")}
              buttonText="VIEW PROFILE"
              center
            >
              <Box>
                <Typography className={classes.pointText}>
                  {self?.firstname ?? ""} {self?.lastname ?? ""}
                </Typography>
                <Typography className={classes.pointText}>
                  {self?.email_address ?? ""}
                </Typography>
                <Typography className={classes.pointText}>
                  {self?.phone_number ?? ""}
                </Typography>
                <Typography className={classes.pointText}>
                  {self?.date_of_birth ?? ""}
                </Typography>
              </Box>
            </BoxDashboard>
            <BoxDashboard
              title="ADDRESSES"
              iconTitleSrc="/images/marker_icon.svg"
              onRedirect={redirect("/account/addresses")}
              buttonText="VIEW ADDRESSES"
              center
            >
              {address && (
                <Box>
                  <Typography className={classes.pointText}>
                    {address?.street_address || ""}
                  </Typography>
                  <Typography className={classes.pointText}>
                    {"#" +
                      address?.unit_no.slice(0, 2) +
                      "-" +
                      address?.unit_no.slice(2, 4) || "-"}{" "}
                    {address?.country || ""} {address?.postal_code || ""}
                  </Typography>
                  <Typography className={classes.pointText}>
                    {address?.contact_number || ""}
                  </Typography>
                </Box>
              )}
            </BoxDashboard>
            <BoxDashboard
              title="PAYMENT METHODS"
              iconTitleSrc="/images/card_icon.svg"
              onRedirect={redirect("/account/payment-methods")}
              buttonText="VIEW PAYMENT"
              center
            >
              {payment ? (
                <Fragment>
                  <Grid container mt={2}>
                    <Grid item lg={2} xs={2} sm={2} md={2}>
                      <ValidateCardCredit
                        brand={payment?.extra0 || "invalid_card"}
                      />
                    </Grid>
                    <Grid item lg={8} xs={8} sm={8} md={8}>
                      <Typography className={classes.iconText}>
                        {payment?.extra1}
                      </Typography>
                    </Grid>
                  </Grid>
                </Fragment>
              ) : (
                "no payment"
              )}
            </BoxDashboard>
          </Grid>
        </Box>
      </Hidden>
      <Hidden smUp>
        <Box width="100%">
          <RowDashboard
            urlImg="/images/Wishlist_icon.svg"
            text="WISHLIST (3)"
            onRedirect={redirect("/account/wishlist")}
          />
          <RowDashboard
            urlImg="/images/file_icon.svg"
            text="PROFILE"
            onRedirect={redirect("/account/profile")}
          />
          <RowDashboard
            urlImg="/images/marker_icon.svg"
            text="ADDRESSES"
            onRedirect={redirect("/account/addresses")}
          />
          <RowDashboard
            urlImg="/images/card_icon.svg"
            text="PAYMENT METHODS"
            onRedirect={redirect("/account/payment-methods")}
          />
        </Box>
      </Hidden>
    </>
  );
};

export default AccountDetailForm;
