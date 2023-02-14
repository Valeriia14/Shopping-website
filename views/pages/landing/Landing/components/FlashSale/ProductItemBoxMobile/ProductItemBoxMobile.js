import { Box, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { RatingStar } from "@ktwebsite/components";
import { cashFormat, ratingStar } from "@ktwebsite/utils/fomatting/diffFormats";
import clsx from "clsx";
import { useStyles } from "./styles";

const ProductItemBoxMobile = ({ item, index }) => {
  const classes = useStyles()
  return (
    <Fragment>
      <Box
        className={clsx(
          classes.productBox,
          (index-2)%5 === 0 ? classes.productBoxFirst : null
        )}
      >
        <Box className={classes.previewBox}>
          <img
            className={classes.img}
            src={item?.preview?.uri || "/images/placeholder.png"}
            alt={item?.name}
            onClick={() => {
              doRedirect(`/products/${item?.handle}`);
            }}
          />
        </Box>
        <Box width="calc(100% - 120px)" padding="16px">
          <Typography className={classes.titleName}>{item?.name}</Typography>
          <Box className={classes.priceBox}>
            {item?.promo_id ? (
              <Fragment>
                <Typography className={classes.price}>
                  {cashFormat(item?.promo_price)}
                </Typography>
                <Typography className={classes.salePrice}>
                  {cashFormat(item?.price)}
                </Typography>
                <Box className={classes.discountPercent}>
                  <Typography>
                    {Math.round(
                      ((item?.price - item?.promo_price) / item?.price) * 100
                    )}
                    %
                  </Typography>
                </Box>
              </Fragment>
            ) : (
              <Fragment>
                <Typography className={classes.price}>
                  {cashFormat(item?.price)}
                </Typography>
              </Fragment>
            )}
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={3}
          >
            <Box display="flex" alignItems="center">
              <RatingStar
                className={classes.rating}
                score={ratingStar(item?.reviews)}
              />
              <Typography className={classes.commentText}>
                &nbsp;{`(${item?.reviews?.length})`}
              </Typography>
            </Box>
          </Box>
          <Box className={classes.tagsBox}>
            <Typography className={clsx(classes.tagText, classes.green)}>
              DEAL
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
};

export default ProductItemBoxMobile;
