import { useCart } from "@ktwebsite/hooks";
import useApi from "@ktwebsite/utils/api/useApi";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import {
  Box,
  Grid,
  Typography,
  Button,
  Hidden,
  Checkbox,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import {
  OrderSummaryWidget,
  CheckoutStepper,
  StickyHeaderBox,
  NavBreadcrumbs,
} from "@ktwebsite/components";
import ProductList from "../ProductList";
import { FreeShipping, VoucherDialog } from "./components";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { useSnackbar } from "notistack";
import cookie from "cookie";
import {
  CheckBoxOutlined,
  CheckBoxOutlineBlankOutlined,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  cartGrid: {
    [theme.breakpoints.down("sm")]: {
      padding: "none",
      width: "100%",
      margin: "0px",
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: 100,
    },
  },
  cartHeaderText: {
    fontSize: "34px",
    fontWeight: 700,
    color: theme.palette.primary.main,
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
    [theme.breakpoints.down("xs")]: {
      padding: "0px !important",
      width: "100%",
      marginTop: 90,
    },
  },
  cartSubTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
    marginTop: "5px",
    width: "280px",
  },
  myVoucherBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItem: "center",
    cursor: "pointer",
    background: "#F7F6FF",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5%",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
    marginTop: theme.spacing(2),
  },
  myVoucherIcon: {
    width: "25px",
    marginTop: "3px",
    marginRight: "5px",
  },
  myVoucherText: {
    color: "#067DFF",
    fontSize: "14px",
  },
  productGridHeader: {
    fontSize: "16px",
    fontWeight: "700",
  },
  productGridHeaderContainer: {
    borderBottom: "3px solid #000000 !important",
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(3),
    alignItems: "center",
  },
  updateCartBtn: {
    float: "right",
    width: "230px",
    border: " 1px solid",
    borderRadius: "0px",
    fontSize: "18px",
    fontWeight: "500",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
    marginTop: theme.spacing(2),
  },
  orderSummaryGridItem: {
    [theme.breakpoints.down("xs")]: {
      padding: "0px !important",
    },
  },
  buttonAdd: {
    borderBottom: "2px solid #000000",
    borderRadius: "0px",
    margin: "40px 0px",
    fontSize: "16px",
    fontWeight: "500",
  },
  buttonAddBox: {
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      justifyContent: "center",
    },
  },
  gridItem: {
    paddingLeft: "32px",
  },
  checkbox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      alignItems: "flex-start",
    },
  },
  inputRoot: {
    fontSize: "14px",
    height: "fit-content",
    color: "black",
    "&$checked": {
      color: "black",
    },
  },
}));

const CartBody = () => {
  const classes = useStyles();
  const [cart, setCart] = useCart();

  const api = useApi();
  const [showVoucherDialog, setShowVoucherDialog] = useState(false);
  const [deleteCartItem] = useAsyncTask("deleteCartItem");
  const [runCartUpdate] = useAsyncTask("runCartUpdate");
  const [isSelected, setIsSelected] = useState({});
  const { enqueueSnackbar } = useSnackbar();

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

  useEffect(() => {
    if (
      window.location.search.indexOf("select_all=true")!==-1 &&
      cart?.cart_items?.length
    ) {
      const selectAll = isSelected;
      cart.cart_items.forEach((item) => {
        selectAll[item.id] = item;
      });
      setIsSelected({ ...selectAll });
    } 
  }, []);

  const CheckboxCustom = (props) => {
    return (
      <Checkbox
        {...props}
        color="default"
        classes={{
          root: classes.inputRoot,
        }}
        className={classes.checkBox}
        icon={<CheckBoxOutlineBlankOutlined className={classes.icon} />}
        checkedIcon={<CheckBoxOutlined className={classes.icon} />}
      />
    );
  };
  return (
    <>
      <Hidden smUp={true}>
        <StickyHeaderBox name={"BAG"} />
      </Hidden>
      <Box mb={5} display="flex" justifyContent="center" alignItems="center">
        <Grid container item spacing={4} className={classes.cartGrid}>
          <Grid item md={8} sm={12} className={classes.productGrid}>
            <Hidden smUp={true}>
              <NavBreadcrumbs
                firstTitle="Home"
                firstLink="/"
                finalTitle="BAG"
              />
            </Hidden>
            <Box>
              <CheckoutStepper
                steps={["BAG", "SHIPPING", "PAYMENT"]}
                activeStep={0}
              />
            </Box>
            <Hidden smUp>
              <FreeShipping isSelected={isSelected} cart={cart} />
            </Hidden>
            <Hidden xsDown={true}>
              <Typography variant="h1" className={classes.cartHeaderText}>
                MY BAG
              </Typography>
            </Hidden>
            <Box display={{ xs: "initial", sm: "initial", md: "initial" }}>
              <Grid
                container
                spacing={0}
                className={classes.productGridHeaderContainer}
              >
                <Grid md={5} item>
                  <Box display="flex" alignItems="center">
                    <CheckboxCustom
                      checked={
                        Object.keys(isSelected).length ==
                        cart?.cart_items?.length
                          ? true
                          : false
                      }
                      onClick={(e) => {
                        if (e.target.checked && cart?.cart_items?.length) {
                          const selectAll = isSelected;
                          cart.cart_items.forEach((item) => {
                            selectAll[item.id] = item;
                          });
                          setIsSelected({ ...selectAll });
                        } else {
                          setIsSelected({});
                        }
                      }}
                      name="select-item"
                    />
                    <Typography
                      variant="body1"
                      className={classes.productGridHeader}
                    >
                      ITEM DETAILS
                    </Typography>
                  </Box>
                </Grid>
                <Hidden smDown>
                  <Grid md={3} className={classes.gridItem} item>
                    <Typography
                      variant="body1"
                      className={classes.productGridHeader}
                    >
                      PRICE
                    </Typography>
                  </Grid>
                  <Grid md={3} className={classes.gridItem} item>
                    <Typography
                      variant="body1"
                      className={classes.productGridHeader}
                    >
                      SUBTOTAL
                    </Typography>
                  </Grid>
                  <Grid md={1} item></Grid>
                </Hidden>
              </Grid>
            </Box>

            {cart?.cart_items?.map((item, index) => (
              <ProductList
                item={item}
                isSelected={isSelected}
                setIsSelected={setIsSelected}
                key={index}
                onDelete={updateItem}
                isLatest={cart?.cart_items?.length - 1 == index}
              />
            ))}
            <Hidden smDown>
              <Box className={classes.buttonAddBox}>
                <Button
                  onClick={() => doRedirect("/")}
                  className={classes.buttonAdd}
                >
                  + Add another item
                </Button>
              </Box>
            </Hidden>
          </Grid>
          <Grid item md={4} sm={12} className={classes.orderSummaryGridItem}>
            <Hidden smDown>
              <FreeShipping isSelected={isSelected} cart={cart} />
            </Hidden>
            <OrderSummaryWidget
              order={cart}
              discount={cart?.discount}
              hideCartWidget={true}
              isSelected={isSelected}
              inCartPage
            />
          </Grid>
        </Grid>
      </Box>
      <VoucherDialog
        open={showVoucherDialog}
        onClose={() => setShowVoucherDialog(false)}
      />
    </>
  );
};
/*


            <Button onClick={()=>{}} className={classes.updateCartBtn}>
              UPDATE CART
            </Button>
*/
export default CartBody;
