import { AccountDashboardHeader, AccountDashboardLayout, BaseButton } from "@ktwebsite/components";
import useApi from "@ktwebsite/utils/api/useApi";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import { Box, Container, Grid, InputBase, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import ReferralEmailForm from "./components/ReferralEmailForm";
import ReferralLinkForm from "./components/ReferralLinkForm";
import RewardPointBanner from "./components/RewardPointBanner";
import StrawReplacementForm from "./components/StrawReplacementForm";
import VoucherTicket from "./components/VoucherTicket";

const useStyles = makeStyles((theme) => ({
  InviteFriends: {
    fontWeight: 600,
    width: "60%",
    marginLeft: "20%"
  },
  rootBox: {
    width: "95%",
    marginLeft: "2.5%"
  },
  referralFormDesktop: {
    [theme.breakpoints.down("xs")]: {
      display: "none"
    },
  },
  referralFormMobile: {
    [theme.breakpoints.up("sm")]: {
      display: "none"
    },
  },
  referralImageWrap: {
    textAlign: "center"
  },
  voucherSubtitle: {
    color: theme.palette.primary.main,
    textAlign: "center"
  },
  ticketContainer: {
    marginTop: theme.spacing(2),
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    }
  },
  voucherShowMore: {
    padding: "2px 10px",
    borderRadius: "50px",
    width: "170px",
    textAlign: "center",
    margin: "20px auto 0",
    border: "1px solid #2d2866",
    backgroundColor: "#fff",
  },
  voucherShowMoreText: {
    fontSize: "12px",
    color: "#2d2866",
    fontWeight: 600
  },
  verifyCouponInputWrap: {
    border: "3px solid #eff0f4",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "340px",
    height: "40px"
  },
  verifyCouponInput: {
    fontSize: "14px",
    width: "100%",
    padding: "8px 14px"
  },
  verifyBtn: {
    padding: "8px 14px",
    backgroundColor: "#2d2866",
  },
  verifyText: {
    color: "#fff",
    fontSize: "14px"
  }
}));

export default (props: any) => {
  const classes = useStyles();
  const [getPoints, loadingPoints, errorGettingPoints] = useAsyncTask("getPoints");
  const [points, setPoints] = useState(0);
  const [loadingList, setLoadingList] = useState(true);

  const api = useApi();

  useEffect(() => {
    if (typeof getPoints !== 'function') {
      return;
    };
    getPoints(async () => {
      let sessionToken = localStorage.getItem("sessionToken");
      const response = await api.path("public/reward_point/available").get();
      const resPoints = response?.data?.result?.models?.point_sum || 0;
      setPoints(resPoints);
      setLoadingList(false);
    })
  }, []);

  return (
    <Box>
      <Container maxWidth="xl" disableGutters>
        <AccountDashboardLayout selected="smileReward">
          <AccountDashboardHeader titleText="KIDZTIME REWARDS!" subTitleText="Kidztime Smiles Reward Points!" />
          <Box className={classes.rootBox}>
            <RewardPointBanner point={points} loadingList={loadingList} />
            <Box mt={2} mb={2}>
              <Typography variant="h5">Received a Kidztime’s Voucher? Key in the voucher to redeem your rewards! Do note that vouchers are one time use only. Terms &amp; conditions applied</Typography>
              <Box mt={1} className={classes.verifyCouponInputWrap}>
                <InputBase name="verify_coupon" placeholder="Your Code" className={classes.verifyCouponInput} />
                <BaseButton
                  buttonClassName={classes.verifyBtn}
                  text="Validate" textClassName={classes.verifyText} />
              </Box>
            </Box>
            <Typography variant="body2">Thank you for supporting Kidztime!</Typography>
            <Box mt={2}>
              <Typography variant="body2">Now you can earn with every Kidztime purchase. For every purchase of Kidztime merchandise, you would receive valuable Rewards Points that are redeemable for cashback, discounts and other goodies! Its FREE and an easy way to save.</Typography>
            </Box>
            <Box mt={2} borderBottom="2px solid #2d2866" width="180px">
              <Typography variant="subtitle2" className={classes.voucherSubtitle}>VOUCHERS COLLECTED</Typography>
            </Box>
            <Box className={classes.ticketContainer}>
              <VoucherTicket points="500" discount="10% OFF" description="!0% discount for first timer" status="expired" valid="valid until 30 Oct 202" />
              <VoucherTicket points="500" discount="10% OFF" description="!0% discount for first timer" status="available" valid="valid until 30 Oct 202" />
            </Box>
            <Box width="100%" alignItems="center">
              <BaseButton
                buttonClassName={classes.voucherShowMore}
                text="Show older vouchers" textClassName={classes.voucherShowMoreText} />
            </Box>
          </Box>
          <AccountDashboardHeader titleText="" subTitleText="Free Straw Replacement" />
          <Box ml={3} width="90%">
            <Typography variant="body2">Mould and bacteria can build up in junior’s bottle over time! Kidztime recommends to change the straw of your child’s bottle every 2-3 months tops.</Typography>
            <Box mt={2}>
              <Typography variant="body2">With purchase of Kidztime’s sipper or straw bottles, you would automatically be entitled to a free straw anytime. Simple contact us for a free replacement straw to be sent to you.</Typography>
            </Box>
            <StrawReplacementForm />
          </Box>
          <AccountDashboardHeader titleText="" subTitleText="Kidztime Referral" />
          <Box ml={3} width="90%">
            <Typography variant="body2">Invite a friend and earn $5!</Typography>
            <Box mt={2}>
              <Typography variant="body2">When a new user applies your code for their purchase, they get SGD 5 off and you get a SGD 5 discount code for your next purchase as well!</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="body2">Simply send your friends your referral code or the give them the link below to instantly apply the referral code to their shopping cart</Typography>
            </Box>
            <Box mt={6}>
              <Grid container item xs={12}>
                <Grid item sm={6} className={classes.referralFormDesktop}>
                  <ReferralLinkForm />
                  <ReferralEmailForm />
                </Grid>
                <Grid item sm={6} className={classes.referralImageWrap}>
                  <img src="/images/referrals-welcome.png" />
                  <Typography variant="h3" className={classes.InviteFriends}>INVITE FRIENDS AND EARN $5 PER INVITE!</Typography>
                </Grid>
                <Grid item xs={12} className={classes.referralFormMobile}>
                  <ReferralLinkForm />
                  <ReferralEmailForm />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </AccountDashboardLayout>
      </Container>
    </Box>
  );
}
