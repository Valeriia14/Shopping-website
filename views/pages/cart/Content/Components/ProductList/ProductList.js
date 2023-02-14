import doRedirect from "@ktwebsite/utils/doRedirect";
import {
  Box,
  Button,
  Typography,
  Grid,
  Collapse,
  Checkbox,
  TextField,
  MenuItem,
  Hidden,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BigNumber from "bignumber.js";
import { useSnackbar } from "notistack";
import React, { Fragment, useState } from "react";
import clsx from "clsx";
import ClearIcon from "@material-ui/icons/Clear";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";
import { cashFormat } from "@ktwebsite/utils/fomatting/diffFormats";

const useStyles = makeStyles((theme) => ({
  cartProductWrap: {
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginLeft: "0px",
    },
  },
  cartProductImgBox: {
    marginRight: "20px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "90px",
    height: "90px",
    [theme.breakpoints.down("xs")]: {
      width: "70px",
      height: "70px",
      padding: "2px",
      margin: 0,
    },
    "& img": {
      background: "#fff",
    },
  },
  cartProductImg: {
    height: "90px",
    [theme.breakpoints.down("xs")]: {
      height: "70px",
    },
  },
  cartProductNameBox: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  cardProductName: {
    fontSize: "16px",
    fontWeight: "700",
  },
  editBtn: {
    border: "1px solid #bebebe",
    width: "38px",
    height: "19px",
    borderRadius: "3px",
  },
  editBtnText: {
    fontSize: "13px",
    fontWeight: 400,
    color: "#707070",
  },
  cartProductSku: {
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: "20px",
  },
  cartProductQty: {
    fontSize: "14px",
    lineHeight: "20px",
  },
  cartProductPriceBox: {
    display: "flex",
    flexDirection: "row",
  },
  cartProductPrice: {
    fontSize: "16px",
    fontWeight: "700",
  },
  cartProductRrp: {
    color: "rgba(45,40,102,0.5)",
    fontSize: "12px",
    textDecoration: "line-through",
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(0.5),
  },
  cartAccessory: {
    fontSize: "13px",
    lineHeight: "20px",
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
  },
  cartAccessorySum: {
    fontSize: "13px",
    lineHeight: "20px",
    marginTop: theme.spacing(1),
  },
  cartAccessoryWrap: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cartAccessoryBox: {
    // border: "1px dashed #2D2866",
    width: "70px",
    height: "70px",
    marginRight: theme.spacing(1),
    marginBottom: "5px",
    position: "relative",
  },
  cartAccessoryImage: {
    height: "100%",
    width: "100%",
  },
  editActions: {
    display: "flex",
    flexDirection: "row",
  },
  cancelText: {
    color: "#D8D8D8",
    textDecoration: "underline",
    fontSize: "12px",
    cursor: "pointer",
  },
  deleteText: {
    color: "#D8D8D8",
    textDecoration: "underline",
    fontSize: "12px",
    marginLeft: theme.spacing(1.5),
    cursor: "pointer",
  },
  accessoryDropdown: {
    width: "80%",
    border: "1px solid #ccc",
    padding: "2px",
  },
  accessoryNativeSelect: {
    fontSize: "14px",
    background: "#fff",
    "&:hover": {
      borderBottom: "none",
    },
    "&:before": {
      border: "none",
    },
    "&:after": {
      border: "none",
    },
  },
  btnCancelAccessory: {
    position: "absolute",
    right: -10,
    top: -10,
  },
  controlQtyWrap: {
    display: "flex",
    alignItems: "center",
  },
  qtyUpdateBox: {
    width: "157px",
    height: "40px",
    border: "1px solid #ccc",
    display: "flex",
    background: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  selectUpdateBox: {
    display: "flex",
    flexDirection: "row",
    minWidth: "280px",
    background: "white",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      minWidth: "auto",
    },
  },
  minusBtn: {
    minWidth: "10px",
    height: "30px",
    "&:hover": {
      background: "none",
    },
  },
  qtyInput: {
    height: "30px",
    width: "100px",
    fontSize: "16px",
    fontWeight: "700",
    align: "center",
    "& input": {
      textAlign: "center",
    },
  },
  plusBtn: {
    minWidth: "10px",
    height: "30px",
    "&:hover": {
      background: "none",
    },
  },
  updateBtnBox: {
    width: 120,
    height: 30,
    marginLeft: "1.5rem",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.primary.dark,
    color: "#fff",
    cursor: "pointer",
  },
  updateBtnBoxDisabled: {
    backgroundColor: theme.palette.primary.disabled,
    color: "#fff !important",
  },
  rowContainer: {
    borderBottom: "1px solid #d8d8d8",
    paddingTop: 20,
    paddingBottom: 20,
  },
  cancelCartBtn: {
    float: "right",
    width: "230px",
    border: " 1px solid",
    borderRadius: "0px",
    fontSize: "14px",
    fontWeight: "500",
    padding: 11,
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
    marginTop: 20,
    background: "white",
  },
  updateCartBtn: {
    float: "right",
    width: "230px",
    border: " 1px solid",
    borderRadius: "0px",
    fontSize: "14px",
    fontWeight: "500",
    padding: 11,
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
    marginTop: 20,
    marginLeft: theme.spacing(1),
    background: "black",
    color: "white",
  },
  updateAddon: {
    marginTop: theme.spacing(1),
  },
  updateGrid: {
    marginLeft: 42,
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0,
    },
  },
  updateCollapse: {
    padding: theme.spacing(2),
    background: "antiquewhite",
    marginTop: "20px",
  },
  cursor: {
    cursor: "pointer",
  },
  inputRoot: {
    fontSize: "14px",
    height: "fit-content",
    color: "black",
    "&$checked": {
      color: "black",
    },
  },
  checked: {},
  mobileEditItemBtn: {
    width: "100%",
    border: " 1px solid",
    borderRadius: "0px",
    fontSize: "14px",
    fontWeight: "500",
    background: "white",
    color: "black",
  },
  mobileBuyNowItemBtn: {
    width: "100%",
    border: " 1px solid",
    borderRadius: "0px",
    fontSize: "14px",
    fontWeight: "500",
    marginLeft: theme.spacing(1),
    background: "black",
    color: "white",
  },
  subTotalBox: {
    [theme.breakpoints.down("xs")]: {
      flexDirection: "row-reverse",
    },
  },
  checkbox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      alignItems: "flex-start",
    },
  },
  editButtonBox: {
    display: "flex",
    alignItems: "flex-end",
    height: "100%",
  },
  editButton: {
    padding: "0",
    minWidth: "fit-content",
    [theme.breakpoints.down("xs")]: {
      alignItems: "flex-start",
      marginTop: "2px",
    },
  },
  textField: {
    width: "100%",
    borderRadius: "0px",
    "& .MuiInputBase-formControl": {
      borderRadius: "0px",
    },
    "& .MuiOutlinedInput-input": {
      margin: "0px !important",
      padding: "8px",
      fontSize: "14px",
      fontWeight: "700",
      paddingLeft: "16px !important",
      height: "40px",
      boxSizing: "border-box",
    },
    "& .MuiSelect-icon": {
      marginRight: 0,
    },
  },
  titleInfoEdit: {
    fontSize: 14,
    fontWeight: "700",
  },
  cartProductContainer: {
    [theme.breakpoints.down("xs")]: {
      paddingLeft: theme.spacing(2),
    },
  },
  gridItem: {
    paddingLeft: "32px",
  },
  rowContainerLatest: {
    borderBottom: "3px solid #000000 !important",
    paddingTop: 20,
    paddingBottom: 20,
    [theme.breakpoints.down("xs")]: {
      border: "0px !important"
    },
  },
}));

const ProductList = (props) => {
  const classes = useStyles({});
  const { enqueueSnackbar } = useSnackbar();
  const { item, isSelected, setIsSelected, onDelete , isLatest } = props;
  const [subtotal, setSubTotal] = useState( // eslint-disable-line
    new BigNumber(item?.product?.promo_price || item?.product?.price)
  );
  const [originalPrice, setOriginalPrice] = useState( // eslint-disable-line
    item?.product?.promo_price || item?.product?.price
  );

  const [isCollapsed, setCollapse] = useState(false);


  const CheckboxCustom = (props) => {
    return (
      <Checkbox
        {...props}
        color="default"
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

  const onUpdateItem = () => {
    enqueueSnackbar("Cart updated", { variant: "success" });
  };

  const handleCancel = () => {
    setCollapse(!isCollapsed);
  };

  return (
    <Fragment>
      <Grid container spacing={0} className={isLatest ? classes.rowContainerLatest : classes.rowContainer}>
        <Grid xs={12} md={5} item>
          <Box className={classes.cartProductWrap}>
            <Box className={classes.checkbox}>
              <CheckboxCustom
                checked={isSelected[item.id] ? true : false}
                onClick={() => {
                  setIsSelected({
                    ...isSelected,
                    [item.id]: isSelected[item.id] ? undefined : item,
                  });
                }}
                name="select-item"
              />
            </Box>
            <Box
              className={classes.cartProductImgBox}
              onClick={() => doRedirect(`/products/${item?.product?.handle}`)}
            >
              <img
                src={
                  item?.product?.preview?.uri
                    ? item?.product?.preview?.uri
                    : "/images/placeholder.png"
                }
                className={classes.cartProductImg}
              />
            </Box>
            <Box flex={1} className={classes.cartProductContainer}>
              <Box className={classes.cartProductNameBox}>
                <Typography variant="body1" className={classes.cardProductName}>
                  {item.product?.name}
                </Typography>
                <Hidden smUp={true}>
                  <Button className={classes.editButton}>
                    <ClearIcon className={classes.cursor} />
                  </Button>
                </Hidden>
              </Box>
              <Box>
                <Typography className={classes.cartProductSku}>
                  {item.product?.sku}
                </Typography>
                <Typography className={classes.cartProductSku}>
                  Design: {item?.design || "-"}
                </Typography>
              </Box>
              <Hidden smUp={true}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  className={classes.cartProductWrap}
                >
                  <Typography className={classes.cartProductPrice}>
                    Price
                  </Typography>
                  <Typography className={classes.cartProductPrice}>
                    ${subtotal.toFormat(2)}
                  </Typography>
                </Box>
              </Hidden>
            </Box>
          </Box>
        </Grid>

        <Hidden smDown>
          <Grid md={3} className={classes.gridItem} item>
            <Box className={classes.cartProductWrap}>
              <Typography className={classes.cartProductPrice}>
                {cashFormat(originalPrice)}
              </Typography>
            </Box>
          </Grid>
          <Grid md={3} className={classes.gridItem} item>
            <Box
              display="flex"
              alignItems="center"
              className={clsx(classes.cartProductWrap, classes.subTotalBox)}
            >
              <Typography className={classes.cartProductPrice}>
                ${subtotal.toFormat(2)}
              </Typography>
            </Box>
          </Grid>
        </Hidden>

        <Hidden smDown>
          <Grid xs={12} md={1} item>
            <Box className={classes.editButtonBox}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-evenly"
                width="100%"
              >
                <Button
                  className={classes.editButton}
                  // onClick={() => setCollapse(!isCollapsed)}
                >
                  <img
                    src="/images/Edit_icon.svg"
                    alt="Edit"
                    className={classes.cursor}
                  />
                </Button>
                <Button
                  onClick={() => {
                    onDelete(item);
                  }}
                  className={classes.editButton}
                >
                  <ClearIcon className={classes.cursor} />
                </Button>
              </Box>
            </Box>
          </Grid>
        </Hidden>

        <Hidden mdUp>
          <Grid xs={12} item>
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              mt="12px"
            >
              <Button
                onClick={() => setCollapse(!isCollapsed)}
                className={classes.mobileEditItemBtn}
              >
                <img src="/images/Edit_icon.svg" alt="edit" />
                &nbsp;EDIT
              </Button>
              <Button className={classes.mobileBuyNowItemBtn}>BUY NOW</Button>
            </Box>
          </Grid>
        </Hidden>

        <Grid xs={12} className={classes.updateGrid} item>
          <Collapse in={isCollapsed}>
            <Grid
              container
              spacing={0}
              className={clsx(classes.rowContainer, classes.updateCollapse)}
            >
              <Grid xs={3} md={2} item className={classes.updateAddon}>
                <Box display="flex" height="100%" alignItems="center">
                  <Typography className={classes.titleInfoEdit}>
                    ADD ON STRAWS:
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={9} md={10} item className={classes.updateAddon}>
                <Box pl={1} className={classes.controlQtyWrap}>
                  <Box className={classes.selectUpdateBox}>
                    <TextField
                      className={classes.textField}
                      variant="outlined"
                      select
                      InputLabelProps={{ shrink: false }}
                    >
                      {[
                        { label: 1, value: 1 },
                        { label: 2, value: 2 },
                      ].map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Box>
              </Grid>
              <Hidden xsDown={true}>
                <Grid xs={12} item>
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <Button
                      onClick={handleCancel}
                      className={classes.cancelCartBtn}
                    >
                      CANCEL
                    </Button>
                    <Button
                      onClick={onUpdateItem}
                      className={classes.updateCartBtn}
                    >
                      UPDATE
                    </Button>
                  </Box>
                </Grid>
              </Hidden>
            </Grid>
            <Hidden smUp={true}>
              <Grid xs={12} item>
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Button
                    onClick={handleCancel}
                    className={classes.cancelCartBtn}
                  >
                    CANCEL
                  </Button>
                  <Button
                    onClick={onUpdateItem}
                    className={classes.updateCartBtn}
                  >
                    UPDATE
                  </Button>
                </Box>
              </Grid>
            </Hidden>
          </Collapse>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default ProductList;
