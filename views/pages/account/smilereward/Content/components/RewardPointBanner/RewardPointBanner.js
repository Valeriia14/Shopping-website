import { Box, Typography, Grid, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment } from "react";

const useStyles = makeStyles((theme) => ({
  rewardPointBox: {
    borderRadius: "10px",
    border: "0px",
    boxShadow: "0 22px 54px 0 rgba(77,95,111,.3)",
    overflow: "hidden",
    display: "flex",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  giftImg: {
    marginLeft: theme.spacing(-6),
    marginBottom: theme.spacing(-6),
    width: "160px",
    height: "114px",
    opacity: "0.5"
  },
  pointText: {
    color: theme.palette.secondary.main,
    fontWeight: 600,
    marginTop: theme.spacing(1)
  },
  expiryText: {
    fontSize: "12px",
    fontWeight: 600,
  },
  expiryCountText: {
    fontSize: "12px",
    color: "#ccc",
    fontWeight: 600,
  },
  rewardPointBoxMobile: {
    borderRadius: "10px",
    border: "0px",
    boxShadow: "0 22px 54px 0 rgba(77,95,111,.3)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  expiryTextMobile: {
    fontSize: "12px",
    fontWeight: 600,
  },
  expiryCountTextMobile: {
    fontSize: "12px",
    color: "#ccc",
    fontWeight: 600,
  },
  gotVoucher: {
    marginTop: theme.spacing(4),
    padding: "5px 6px",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "4px",
    textAlign: "center"
  },
  pointTextMobile: {
    color: theme.palette.secondary.main,
    fontWeight: 600,
  },
  gotVoucherText: {
    color: "#fff",
    fontSize: "13px",
    fontWeight: "600"
  },
  giftImgMobile: {
    width: "160px",
    height: "114px",
    position: "absolute",
    opacity: "0.5",
    marginTop: theme.spacing(6),
    marginLeft: theme.spacing(1)
  }
}));

const ReferralEmailForm = props => {

  const classes = useStyles({});
  const { point, loadingList } = props;

  return (
    <Fragment>
      <Box mb={5} p={2} className={classes.rewardPointBox}>
        <Box>
          <img src="/images/gift.svg" className={classes.giftImg} />
        </Box>
        <Box display="flex" flex-direction="row" justifyContent="space-between" width="100%">
          <Box ml={2}>
            <Typography variant="subtitle2">BALANCE REWARD POINTS</Typography>
            {loadingList ?
              <CircularProgress />
              :
              <Typography variant="h2" className={classes.pointText}>{point} Pts</Typography>
            }
          </Box>
        </Box>
      </Box>
      <Box mb={5} p={2} className={classes.rewardPointBoxMobile}>
        <Box>
          <Typography variant="h3">BALANCE REWARD POINTS</Typography>
        </Box>
        <Grid container item xs={12}>
          <Grid item xs={8}>
            <Grid item xs={12}>
              <Typography variant="h2" className={classes.pointTextMobile}>{point} Pts</Typography>
            </Grid>
            <Grid item xs={12}>
              <Box className={classes.gotVoucher}>
                <Typography variant="button" className={classes.gotVoucherText}>Got a Voucher? Redeem below</Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <img src="/images/gift.svg" className={classes.giftImgMobile} />
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default ReferralEmailForm;