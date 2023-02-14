import {
  Box,
  Typography,
  Grid,
  Divider,
  Hidden,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment, useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  subTitle: {
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: "19px",
    padding: theme.spacing(1, 0),
  },
  radioButton: {
    fontWeight: "bold",
    fontSize: "16px",
    lineHeight: "20px",
    color: "#000000",
    "&.Mui-checked": {
      color: "#000000",
    },
  },
  productImageBox: {
    backgroundColor: "#D8D8D8",
    width: "65px",
    height: "86px",
    marginTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  productImage: {
    width: "inherit",
    height: "inherit",
  },
  descriptionText: {
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "20px",
  },
  displayFlex: {
    display: "flex",
  },
  Divider: {
    margin: "12px 0px",
    backgroundColor: "black",
  },
}));

const PromptProductTable = (props) => {
  const classes = useStyles({});
  const { item, label } = props;
  const RadioButton = () => {
    return (
      <FormControlLabel
        control={
          <Radio
            checked={true}
            value="a"
            name="radio-buttons"
            className={classes.radioButton}
          />
        }
        label={<Typography className={classes.subTitle}>{label}</Typography>}
      />
    );
  };

  return (
    <Box className={classes.root} width="100%">
      <Box mt={5}>
        <Grid container>
          <Grid item lg={4} md={4} xs={12} sm={12}>
            <Typography className={classes.subTitle}>PRODUCT</Typography>
          </Grid>
          <Hidden mdDown>
            <Grid item lg={4} xs={4} md={4} sm={4}>
              <Typography className={classes.subTitle}>PRICE</Typography>
            </Grid>
            <Grid item lg={4} xs={4} md={4} sm={4}>
              <Typography className={classes.subTitle}>REQUEST</Typography>
            </Grid>
          </Hidden>
        </Grid>
      </Box>
      <Divider className={classes.Divider} />
      <Box width="100%">
        {item && (
          <Fragment>
            <Grid container spacing={2}>
              <Grid
                item
                lg={4}
                md={4}
                xs={12}
                sm={12}
                className={classes.displayFlex}
              >
                <Grid item lg={4} xs={4} md={4} sm={4}>
                  <Box className={classes.productImageBox}>
                    {item.product?.preview && (
                      <img
                        src={item.product.preview.uri}
                        className={classes.productImage}
                        alt="design"
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item lg={8} xs={8} md={8} sm={8}>
                  <Box display="flex" direction="row">
                    <Typography className={classes.subTitle}>
                      {item.product?.name}
                    </Typography>
                  </Box>
                  <Typography className={classes.descriptionText}>
                    Design: Paw Patrol
                  </Typography>
                  <Typography className={classes.descriptionText}>
                    Add on Caps: None
                  </Typography>
                  <Typography className={classes.descriptionText}>
                    Add on Straw: None
                  </Typography>
                  <Hidden mdUp>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      <Typography className={classes.subTitle}>
                        ${item.product?.price}
                      </Typography>
                      <RadioButton />
                    </Box>
                  </Hidden>
                </Grid>
              </Grid>
              <Hidden mdDown>
                <Grid item lg={4} xs={4} md={4} sm={4}>
                  <Typography className={classes.subTitle}>
                    ${item.product?.price}
                  </Typography>
                </Grid>
                <Grid item lg={4} xs={4} md={4} sm={4}>
                  <RadioButton />
                </Grid>
              </Hidden>
            </Grid>
          </Fragment>
        )}
      </Box>
    </Box>
  );
};

export default PromptProductTable;
