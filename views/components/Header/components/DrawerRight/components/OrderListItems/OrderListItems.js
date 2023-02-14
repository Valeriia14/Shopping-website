import {
  Box,
  Button,
  Divider,
  Grid,
  Hidden,
  List,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import pascalize from "@ktwebsite/utils/fomatting/pascalize";
import { cashFormat } from "@ktwebsite/utils/fomatting/diffFormats";
import { useCart } from "@ktwebsite/hooks";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import cookie from "cookie";
import useApi from "@ktwebsite/utils/api/useApi";
import { useSnackbar } from "notistack";
import { calSubtotal } from "@ktwebsite/utils/fomatting/calculate";
const useStyles = makeStyles((theme) => ({
  productList: {
    width: "100%",
    overflow: "auto",
    padding: "0px",
    height: "calc(100vh - 435px)",
    [theme.breakpoints.down("xs")]: {
      height: "calc(100vh - 290px)",
    },
  },
  productItemBox: {
    padding: "20px 30px",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
    },
  },
  boxImage: {
    width: "150px",
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  image: {
    height: "150px"
  },
  informationBox: {
    padding: "0 0 0 32px",
    width: "calc(100% - 150px)",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      padding: "22px 20px",
    },
  },
  nameProduct: {
    fontSize: "16px",
    fontWeight: 700,
    marginRight: 32,
  },
  button: {
    padding: 0,
    minWidth: "fit-content",
    borderRadius: 25,
    height: "fit-content",
    marginTop: 4,
  },
  fonsize14: {
    fontSize: 14,
  },
  textField: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: theme.spacing(0),
    },
    "& .MuiOutlinedInput-input": {
      padding: "8px",
      margin: "0px !important",
      paddingLeft: "16px !important",
      fontSize: "14px",
    },
    "& .MuiSelect-icon": {
      marginRight: 0,
    },
  },
  totalBox: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  adjustQuantityBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #8A8A8A",
    justifyContent: "space-between",
    minWidth: 120,
  },
  adjustQuantityButton: {
    padding: 8,
    minWidth: "fit-content",
  },
  divider: {
    margin: "0 30px",
    backgroundColor: "#000000",
    [theme.breakpoints.down("xs")]: {
      margin: "0px 20px",
    },
  },
  subtotalBoxMobile: {
    backgroundColor: "#DEDCD0",
    padding: "46px 20px 36px 20px",
    bottom: 0,
  },
  lineBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bodyText: {
    fontSize: "14px",
    fontWeight: 700,
  },
  quantityTitle: {
    fontWeight: 700,
  },
  textSubtotal: {
    fontSize: 16,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 700,
  },
  contentFooter: {
    fontSize: 16,
    fontWeight: 500,
  },
  dividerFooter: {
    margin: "21px 0px 17px 0",
    backgroundColor: "#b3b3b3",
  },
}));
const OrderListItems = (props) => {
  const classes = useStyles();
  const { total } = props;
  const [cart, setCart] = useCart();
  const api = useApi();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteCartItem] = useAsyncTask("deleteCartItem");
  const [runCartUpdate] = useAsyncTask("updateCart");

  const product1 = {
    // design: "Paw Patrol",
    // size: "500ML",
    // "add on caps": "null",
    // "add on straws": "null",
  };
  const design = {
    pawpatrol: "Paw Patrol",
    Kidztime: "Kidz Time",
  };
  const updateItem = (item) => {
    deleteCartItem(async () => {
      const cart_item_id = item?.id;
      await api.path("public/cart/cart_item/delete", { cart_item_id }).del();
      reloadCart();
      enqueueSnackbar("Deleted cart item", {
        variant: "success",
      });
    });
  };

  const reloadCart = () => {
    runCartUpdate(async () => {
      const session_ids = cookie.parse(document?.cookie)?.session_ids || null;
      const response = await api
        .path("public/cart/cart_item/list", { session_ids })
        .get();
      const cart = response.data.result;
      setCart(cart);
    });
  };

  const showContent = () => {
    return Object.keys(product1)?.map((key, index) => {
      const options = Object.values(design) || [];
      return (
        <Grid key={index} container alignItems="center" spacing={2}>
          <Grid item xs={4}>
            <Typography className={classes.bodyText}>
              {key.toUpperCase()}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <TextField
              value={product1[key] || ""}
              className={classes.textField}
              variant="outlined"
              select
              SelectProps={{
                IconComponent: (props) => {
                  return (
                    <Box right="16px!important" {...props}>
                      <img
                        src="/images/Dropdown_icon.svg"
                        alt="Dropdown icon"
                      />
                    </Box>
                  );
                },
              }}
              InputLabelProps={{ shrink: false }}
            >
              {options.map((each, id) => {
                if (typeof each === "string") {
                  return (
                    <MenuItem
                      className={classes.fonsize14}
                      value={each}
                      key={id}
                    >
                      {pascalize(each)}
                    </MenuItem>
                  );
                } else {
                  return (
                    <MenuItem value={each.value} key={id}>
                      {each.node}
                    </MenuItem>
                  );
                }
              })}
            </TextField>
          </Grid>
        </Grid>
      );
    });
  };

  return (
    <Box>
      {cart?.cart_items?.length > 0 && (
        <List className={classes.productList}>
          {cart?.cart_items?.map((item, index, acc) => {
            return (
              <li key={index}>
                <Divider className={classes.divider} />
                <Box className={classes.productItemBox} display="flex">
                  <Box className={classes.boxImage}>
                    <img
                      className={classes.image}
                      src={
                        item?.product?.preview?.uri || "/images/placeholder.png"
                      }
                      alt=""
                    />
                  </Box>
                  <Box className={classes.informationBox}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography
                        variant="body2"
                        className={classes.nameProduct}
                      >
                        {item?.product?.name}
                      </Typography>
                      <Button
                        onClick={() => updateItem(item)}
                        className={classes.button}
                      >
                        <CloseIcon />
                      </Button>
                    </Box>
                    <Box margin="16px 0">{showContent()}</Box>
                    <Box
                      display="flex"
                      alignItems="flex-end"
                      justifyContent="space-between"
                    >
                      <Box display="flex" flexDirection="column" width="100%">
                        <Box className={classes.totalBox}>
                          <Typography
                            variant="body2"
                            className={classes.quantityTitle}
                          >
                            PRICE
                          </Typography>
                          <Typography className={classes.textSubtotal}>
                            <b>
                              {item?.product?.promo_price
                                ? cashFormat(item?.product?.promo_price)
                                : cashFormat(item?.product?.price)}
                            </b>
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                {acc?.length - 1 === index && (
                  <Hidden smUp={true}>
                    <Box className={classes.subtotalBoxMobile}>
                      <Box className={classes.lineBox}>
                        <Typography className={classes.footerTitle}>
                          SUBTOTAL
                        </Typography>
                        <Typography className={classes.textSubtotal}>
                          <b>{cashFormat(calSubtotal(cart?.cart_items))}</b>
                        </Typography>
                      </Box>
                      <Box className={classes.lineBox}>
                        <Typography className={classes.footerTitle}>
                          TAX
                        </Typography>
                        <Typography className={classes.contentFooter}>
                          Inclusive of 7% GST
                        </Typography>
                      </Box>
                      <Box className={classes.lineBox}>
                        <Typography className={classes.footerTitle}>
                          SHIPPING
                        </Typography>
                        <Typography className={classes.contentFooter}>
                          {calSubtotal(cart?.cart_items) >= 30
                            ? cashFormat(0)
                            : cart?.shipping
                            ? cashFormat(cart?.shipping)
                            : "Not yet Calculated"}
                        </Typography>
                      </Box>
                      <Divider className={classes.dividerFooter} />
                      <Box className={classes.lineBox}>
                        <Typography className={classes.footerTitle}>
                          TOTAL
                        </Typography>
                        <Typography className={classes.textSubtotal}>
                          <b>{total}</b>
                        </Typography>
                      </Box>
                    </Box>
                  </Hidden>
                )}
              </li>
            );
          })}
        </List>
      )}
      {(cart?.cart_items?.length <= 0 || !cart?.cart_items?.length) && (
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          className={classes.productList}
        >
          <img src="/images/shopping-cart.png" alt="shopping-cart" />
          <Typography>Your Cart Is Emty!</Typography>
        </Box>
      )}
    </Box>
  );
};

export default OrderListItems;
