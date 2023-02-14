import { Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment } from "react";
import { BaseButton, BaseInput } from "@ktwebsite/components";

const useStyles = makeStyles((theme) => ({
  ticketMainWrap: {
    overflow: "hidden",
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
    width: "100%",
    maxHeight: "140px",
    display: "inline-block",
    position: "relative",
    maxWidth: "340px"
  },
  ticketImg: {
    width: "100%",
    minHeight: "140px",
    zIndex: 0
  },
  ticketContentWrap: {
    display: "flex",
    height: "100%",
    width: "100%",
    zIndex: 100,
    top: 0,
    position: "absolute",
    minHeight: "140px",
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
    fontSize: "30px",
    fontWeight: 600
  },
  discountDescText: {
    fontSize: "13px",
    maxHeight: "36px"
  },
  termsText: {
    fontSize: "13px",
    color: "#3e3e3e"
  },
  rewardStatusAvailabe: {
    backgroundColor: "#1cb372",
    padding: "4px 14px",
    color: "#fff",
    height: "28px",
    borderRadius: "3px",
    marginTop: "5px",
    width: "40%",
    marginLeft: "8%"
  },
  rewardStatusExpired: {
    backgroundColor: "#979797",
    padding: "4px 14px",
    color: "#fff",
    height: "28px",
    borderRadius: "3px",
    marginTop: "5px",
    width: "40%",
    marginLeft: "8%"
  },
  rewardStatusText: {
    textAlign: "center",
    fontSize: "13px",
    fontWeight: 600
  }
}));

const VoucherTicket = props => {

  const classes = useStyles({});
  const { points, discount, description, status, valid } = props;
  return (
    <Fragment>
      <Box className={classes.ticketMainWrap}>
        <img src="/images/ticket.png" className={classes.ticketImg} />
        <Box className={classes.ticketContentWrap}>
          <Box className={classes.ticketItemLeft}>
            <img src="/images/smile.svg" className={classes.smileImage} />
            <Typography variant="body2" className={classes.pointsText}>{points} points</Typography>
          </Box>
          <Box className={classes.ticketItemRight}>
            <Box>
              <Typography variant="body2" className={classes.discountText}>{discount}</Typography>
            </Box>
            <Box width="100%" display="flex" flexDirection="row">
              <Box width="48%">
                <Typography variant="body2" className={classes.discountDescText}>{description}</Typography>
              </Box>
              {status == "available" &&
                <Box className={classes.rewardStatusAvailabe}>
                  <Typography variant="body2" className={classes.rewardStatusText}>Available</Typography>
                </Box>
              }
              {status == "expired" &&
                <Box className={classes.rewardStatusExpired}>
                  <Typography variant="body2" className={classes.rewardStatusText}>Expired</Typography>
                </Box>
              }
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
