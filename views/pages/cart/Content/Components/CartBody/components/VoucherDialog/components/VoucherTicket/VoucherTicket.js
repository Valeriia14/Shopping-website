import { Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment } from "react";

const useStyles = makeStyles((theme) => ({
  ticketMainWrap: {
    overflow: "hidden",
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
    width: "100%",
    maxHeight: "100px",
    display: "inline-block",
    position: "relative",
    maxWidth: "500px",
    [theme.breakpoints.down("xs")]: {
      width: "280px",
    }
  },
  ticketImg: {
    width: "100%",
    minHeight: "100px",
    zIndex: 0
  },
  ticketContentWrap: {
    display: "flex",
    height: "100%",
    width: "100%",
    zIndex: 100,
    top: 0,
    position: "absolute",
    minHeight: "100px",
  },
  ticketItemLeft: {
    borderRight: "2px dashed #2d2866",
    padding: theme.spacing(1),
    width: "110px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  ticketItemRight: {
    padding: "2px 10px 10px",
    width: "calc(100% - 110px)"
  },
  smileImage: {
    width: "50px",
    height: "50px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  },
  pointsText: {
    color: "#f1cf00",
    fontWeight: 600
  },
  discountText: {
    fontSize: "24px",
    fontWeight: 600
  },
  discountDescText: {
    fontSize: "12px",
    maxHeight: "36px"
  },
  termsText: {
    fontSize: "11px",
    color: "#3e3e3e"
  },
  rewardStatusAvailabe: {
    backgroundColor: "#1cb372",
    padding: "4px 14px",
    color: "#fff",
    height: "28px",
    borderRadius: "3px",
    marginTop: "5px",
    width: "30%",
    marginLeft: "15%"
  },
  rewardStatusExpired: {
    backgroundColor: "#979797",
    padding: "4px 14px",
    color: "#fff",
    height: "28px",
    borderRadius: "3px",
    marginTop: "5px",
    width: "30%",
    marginLeft: "15%"
  },
  rewardStatusText: {
    textAlign: "center",
    fontSize: "12px",
    fontWeight: 600
  }
}));

const VoucherTicket = props => {

  const classes = useStyles({});
  const { points, discount, description, status, valid } = props;
  return (
    <Fragment>
      <Box className={classes.ticketMainWrap}>
        <img src="/images/voucherticketlong.png" className={classes.ticketImg} />
        <Box className={classes.ticketContentWrap}>
          <Box className={classes.ticketItemLeft}>
            <img src="/images/smileCart.svg" className={classes.smileImage} />
            <Typography variant="body2" className={classes.pointsText}>{points} points</Typography>
          </Box>
          <Box className={classes.ticketItemRight}>
            <Box>
              <Typography variant="body2" className={classes.discountText}>{discount}</Typography>
            </Box>
            <Box width="100%" display="flex" flexDirection="row">
              <Box width="100%">
                <Typography variant="body2" className={classes.discountDescText}>{description}</Typography>
              </Box>
            </Box>
            <Box position="absolute" bottom="0" mb={1}>
              <Typography variant="body2" className={classes.termsText}>{valid} Other T&amp;C apply</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
};

export default VoucherTicket;