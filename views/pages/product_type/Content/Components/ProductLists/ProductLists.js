import {
  Box,
  Grid,
  Slide,
  Typography,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import React, { useCallback, useEffect, useState } from "react";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import clsx from "clsx";
import { useStyles } from "./styles";
import { useModel } from "@ktwebsite/hooks";
import { cashFormat, ratingStar } from "@ktwebsite/utils/fomatting/diffFormats";
import doRedirect from "@ktwebsite/utils/doRedirect";

const ProductLists = (props) => {
  const classes = useStyles();
  const [offset, setOffset] = useState(8);
  const [model, setModel] = useModel();
  const [modelSlice, setModelSlice] = useState([]);

  useEffect(() => {
    if(model?.products){
      setModelSlice(model?.products?.slice(0, 9))
    }
  }, [model])

  const handleShowMore = useCallback(() => {
    if (offset < model?.products?.length) {
      setOffset(offset + 9);
      setModelSlice([...model?.products?.slice(0, offset + 9)]);
    }
  }, [offset, model]);
  const handleShowLess = useCallback(() => {
    setOffset(9);
    setModelSlice([...model?.products?.slice(0, 9)]);
  }, [model]);
  const showContent = useCallback(() => {
    return modelSlice?.map((item, index) => {
      return (
        <Slide key={index} in={true} timeout={500}>
          <Grid id={`item${index}`} xs={6} md={4} item>
            <Box className={classes.productBox}>
              <img
                className={classes.img}
                src={item?.preview?.uri || "/images/placeholder.png"}
                alt={item?.name}
                onClick={()=>{ doRedirect(`/products/${item?.handle}`)}}
              />
              <Box padding="16px">
                <Typography className={classes.titleName}>
                  {item?.name}
                </Typography>
                <Typography className={classes.price}>
                  {cashFormat(item?.price)}
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={3}
                >
                  <Box display="flex" alignItems="center">
                    <Rating
                      className={classes.rating}
                      name="read-only"
                      readOnly
                      value={ratingStar(item?.reviews)}
                      precision={0.1}
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
                  {item?.is_sale && (
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
          </Grid>
        </Slide>
      );
    });
  }, [classes, modelSlice]);
  return (
    <Grid xs={12} md={9} item>
      <Box className={classes.root}>
        <Grid container>{showContent()}</Grid>
        <Box
          pt={10}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {model?.products?.length > 9 && model?.products?.length !== modelSlice.length && (
            <a
              onClick={handleShowMore}
              className={classes.button}
            >
              LOAD MORE ITEMS
            </a>
          )}
          { model?.products?.length > 9 && model?.products?.length === modelSlice.length && (
            <a href="#item3" onClick={handleShowLess} className={classes.button}>
              SHOW LESS ITEMS
            </a>
          )}
          <Typography className={classes.limitText}>
            Showing {modelSlice.length} items of {model?.products?.length} items
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default ProductLists;
