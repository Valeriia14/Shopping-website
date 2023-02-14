import { Box, Grid, Hidden, makeStyles, Typography } from "@material-ui/core";
import React, { Fragment, useState, useMemo } from "react";
import { usePageData } from "@ktwebsite/hooks";
import ProductItemBoxMobile from "../ProductItemBoxMobile";

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "contents",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginTop: 30,
    },
  },
  arrLeftIcon: {
    transform: "rotate(-180deg)",
    height: "12px",
  },
  arrRightIcon: {
    height: "12px",
  },
  textPagination: {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "17px",
    textAlign: "center",
    margin: "0px 14px",
  },
}));
const ProductListingMobile = () => {
  const classes = useStyles();
  const data = usePageData();
  const { products_flash_promo_sale } = data;
  const [model, setModel] = useState(products_flash_promo_sale.slice(0, 3));
  const [pagination, setPagination] = useState(
    products_flash_promo_sale?.length > 0 ? 1 : 0
  );
  const totalPage = useMemo(() => {
    return (
      (products_flash_promo_sale?.length -
        (products_flash_promo_sale?.length % 3)) /
        3 +
      (products_flash_promo_sale?.length % 3 > 0 ? 1 : 0)
    );
  }, [products_flash_promo_sale]);

  const handleSwitchPage = (value) => {
    if (value === 1 && pagination < totalPage) {
      setPagination(pagination + 1);
      setModel(
        products_flash_promo_sale.slice(3 * pagination, 3 * (pagination + 1))
      );
    } else if (value === -1 && pagination > 1) {
      setPagination(pagination - 1);
      setModel(
        products_flash_promo_sale.slice(
          3 * (pagination - 2),
          3 * (pagination - 1)
        )
      );
    }
  };

  return (
    <Box className={classes.root}>
      <Box>
        {model?.map((item, index) => {
          return (
            <Fragment key={index}>
              <ProductItemBoxMobile
                item={item}
                index={index}
                classes={classes}
              />
            </Fragment>
          );
        })}
      </Box>
      <Box
        display="flex"
        width="100%"
        justifyContent="center"
        pt="30px"
        pb="50px"
      >
        <Box display="flex" alignItems="center">
          <Box onClick={() => handleSwitchPage(-1)}>
            <img
              src="/images/arrow_right_bold.svg"
              alt="arrow_left_bold"
              className={classes.arrLeftIcon}
            />
          </Box>
          <Typography className={classes.textPagination}>
            {pagination} / {totalPage}
          </Typography>
          <Box onClick={() => handleSwitchPage(1)}>
            <img
              src="/images/arrow_right_bold.svg"
              alt="arrow_right_bold"
              className={classes.arrRightIcon}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductListingMobile;
