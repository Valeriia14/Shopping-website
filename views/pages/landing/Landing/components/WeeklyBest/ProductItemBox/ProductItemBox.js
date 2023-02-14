import { Box, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { RatingStar } from "@ktwebsite/components";
import { cashFormat, ratingStar } from "@ktwebsite/utils/fomatting/diffFormats";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import clsx from "clsx";

const ProductItemBox = ({ item, classes, index, swipping }) => {
  return (
    <Box key={index} className={classes.productBox}>
      <Box className={classes.ordinalsBox}>
        <Typography>{index + 1}</Typography>
      </Box>
      <Box className={classes.previewBox}>
        <img
          className={classes.img}
          src={item?.preview?.uri || "/images/placeholder.png"}
          alt={item?.name}
          onClick={() => {
            !swipping && doRedirect(`/products/${item?.handle}`);
          }}
        />
      </Box>
      <Box padding="16px">
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
          <FavoriteBorderIcon fontSize="inherit" />
        </Box>
        <Box className={classes.tagsBox}>
          {item?.is_new && (
            <Typography className={clsx(classes.tagText, classes.pink)}>
              NEW
            </Typography>
          )}
          {item?.promo_id && (
            <Typography className={clsx(classes.tagText, classes.blue)}>
              SALE
            </Typography>
          )}
          {item?.has_gift && (
            <Typography className={clsx(classes.tagText, classes.red)}>
              FREE GIFT
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductItemBox;
