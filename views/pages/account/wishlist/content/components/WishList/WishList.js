import React, { useCallback } from "react";
import { Box, Button, Grid, makeStyles, Typography,Hidden } from "@material-ui/core";
import StarIcon from "@material-ui/icons/Star";
import { IconComponent, BaseButton } from "@ktwebsite/components";
const useStyles = makeStyles((theme) => ({
  productImage: {
    backgroundColor: "#D8D8D8",
    width: "100%",
    height: "361px",
    maxWidth: "300px",
    [theme.breakpoints.down("md")]: {
      height: "200px",
    }
  },
  button: {
    fontSize: "10px",
    lineHeight: "12px",
    fontWeight: "normal",
    textTransform: "uppercase",
    backgroundColor: "#000000",
    color: "#FFFFFF",
    marginRight: theme.spacing(1),
    borderRadius: "unset",
    marginTop:theme.spacing(1)
  },
  price: {
    fontSize: "24px",
    lineHeight: "28px",
  },
  subTitle: {
    fontSize: "16px",
    lineHeight: "28px",
  },
  discountPrice: {
    fontSize: "24px",
    lineHeight: "28px",
    color: "#D20000",
    margin: "0px 2px"
  },
  oldPrice: {
    color: "#7B7B7B",
    fontSize: "14px",
    lineHeight: "16px",
    textDecorationLine: "line-through",
    paddingTop: "8px",
  },
  iconDelete: {
    backgroundColor: "#FFFFFF",
    padding: theme.spacing(2,1),
    borderRadius: "50%",
    fontSize: "16px",
    float: "right",
    margin: theme.spacing(1),
  },
  productBox:{
    marginTop: theme.spacing(3)
  }
}));

const WishList = (props) => {
  const classes = useStyles();
  const { wishList, handleDeleteItem } = props;
  const deletewishListItem = (id) => {
    handleDeleteItem(wishList.filter((item) => item.id != id));
  };
  return (
    <Grid container spacing={2}>
      {wishList &&
        wishList.map((item, index) => (
          <Grid item xs={6} sm={6} lg={4} md={4} key={index} className={classes.productBox}>
            <Box className={classes.productImage}>
              <BaseButton
                onClick={() => deletewishListItem(item.id)}
                buttonClassName={classes.iconDelete}
                iconComponent={
                  <IconComponent
                    name="deleteIconGrey"
                  />
                }
              />
            </Box>
            <Box display="flex" flexDirection="row" mt={2} mb={2}>
              <Hidden smDown>
                {item.discount && (
                  <Typography className={classes.discountPrice}>
                    {item.discount}
                  </Typography>
                )}
              </Hidden>
              <Typography
                className={
                  item.discount ? classes.discountPrice : classes.price
                }
              >
                ${item.price}
              </Typography>
              {item.oldPrice && (
                <Typography className={classes.oldPrice}>
                  ${item.oldPrice}
                </Typography>
              )}
            </Box>
            <Typography className={classes.subTitle}>
              {item.description}
            </Typography>
            <Box display="flex" flexDirection="row" mt={1}>
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <Typography className={classes.subTitle}>
                ({item.rate || 0})
              </Typography>
            </Box>
            <Box mt={1}>
              {item.categories &&
                item.categories.map((category, index) => (
                  <Button className={classes.button} key={index}>
                    {category}
                  </Button>
                ))}
            </Box>
          </Grid>
        ))}
    </Grid>
  );
};

export default WishList;
