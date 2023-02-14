import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import ProductImage from "../../ProductImage";
import { BaseButton } from "@ktwebsite/components";

const useStyles = makeStyles((theme) => ({
  imgGrid: {
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  imgGridMobile: {
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "block"
    }
  },
  orderItemImg: {
    width: "100%",
    paddingRight: "10px",
    [theme.breakpoints.down("xs")]: {
      width: "80px"
    }
  },
  productNameText: {
    fontSize: "16px"
  },
  productSkuText: {
    fontSize: "13px",
    color: "rgba(0,0,0,0.5)"
  },
  productQtyText: {
    fontSize: "13px",
    color: "rgba(0,0,0,0.5)",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  productPriceText: {
    fontSize: "16px",
    color: "#2d2866",
    fontWeight: "bold"
  },
  productFormerPriceText: {
    textDecoration: "line-through",
    marginLeft: "3px",
    color: "rgba(0,0,0,0.5)",
    fontSize: "12px",
    fontWeight: "bold",
    marginTop: "4px"
  },

  reviewBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  returnBtn: {
    borderRadius: "24px",
    border: "1px solid #2d2866",
    background: "#fff",
    height: "30px",
    [theme.breakpoints.down("xs")]: {
      width: "50%"
    }
  },
  returnBtnText: {
    textAlign: "center",
    color: "#2d2866",
    fontSize: "14px",
    fontWeight: "bold",
    [theme.breakpoints.down("xs")]: {
      fontSize: "9px"
    }
  },
  reviewBtn: {
    borderRadius: "24px",
    border: "1px solid #2d2866",
    background: "#fff",
    height: "30px",
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      width: "50%"
    }
  },
  reviewBtnText: {
    textAlign: "center",
    color: "#2d2866",
    fontSize: "14px",
    fontWeight: "bold",
    [theme.breakpoints.down("xs")]: {
      fontSize: "9px"
    }
  },
  accessory: {
    color: "rgba(0,0,0, 0.5)",
    fontSize: "13px",
    lineHeight: "20px",
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1)
  },
  accessoryWrap: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  accessoryBox: {
    border: "1px dashed #2D2866",
    width: "70px",
    height: "70px",
    marginRight: theme.spacing(1),
    marginBottom: "5px"
  },
  accessorySum: {
    color: "rgba(0,0,0, 0.5)",
    fontSize: "13px",
    lineHeight: "20px",
  },
  accessoryImage: {
    height: '100%',
    width: '100%',
  },
}));

const OrderItem = props => {
  const classes = useStyles();
  const { item } = props;
  const { accessory, gift } = item;

  return (
    <Grid container item xs={12}>
      <Grid item xs={2} className={classes.imgGrid}>
        <ProductImage src={item.preview?.uri}/>
      </Grid>
      <Grid item xs={12} sm={10}>
        <Box display="flex" flexDirection="row">
          <Box className={classes.imgGridMobile}>
            <ProductImage src={item.preview?.uri}/>
          </Box>
          <Box>
            <Typography className={classes.productNameText}>{item?.name}</Typography>
            <Typography className={classes.productSkuText}>Item: {item?.sku}</Typography>
            <Typography className={classes.productQtyText}>Qty: {item?.quantity}</Typography>
            {accessory && (
              <Box>
                <Typography className={classes.accessory}>Accessory</Typography>
                <Box className={classes.accessoryWrap}>
                  <Box className={classes.accessoryBox}>
                    <ProductImage src={accessory.preview?.uri}/>
                  </Box>
                </Box>
                <Typography className={classes.accessorySum}>Sum: ${accessory.price}</Typography>
              </Box>
            )}
            {gift && (
              <Box>
                <Typography className={classes.accessory}>Gift</Typography>
                <Box className={classes.accessoryWrap}>
                  <Box className={classes.accessoryBox}>
                    <ProductImage src={gift.preview?.uri}/>
                  </Box>
                </Box>
                <Typography className={classes.accessorySum}>Sum: ${gift.price}</Typography>
              </Box>
            )}
            <Box display="flex" flexDirection="row" mt={2}>
              <Typography className={classes.productPriceText}>SGD {item?.subtotal}</Typography>
            </Box>
          </Box>
        </Box>
        <Box className={classes.reviewBox}>
          <BaseButton text="Request Exchange/Return" buttonClassName={classes.returnBtn} textClassName={classes.returnBtnText} />
          <BaseButton text="Write a product review" buttonClassName={classes.reviewBtn} textClassName={classes.reviewBtnText} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default OrderItem;
