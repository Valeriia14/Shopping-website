import { Box, Typography, Grid, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment, useEffect, useState } from "react";
import { useSelfAccount } from "@ktwebsite/hooks";
import Modal from "@material-ui/core/Modal";
import { BaseButton } from "@ktwebsite/components";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {},
  buttonText: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#FFFFFF",
  },
  button: {
    color: "white",
    backgroundColor: "black",
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(2),
    "&:hover": {
      backgroundColor: "#1565C0",
    },
    width: 245,
    height: 48,
    borderRadius: "unset",
    [theme.breakpoints.down("md")]: {
      width: 164,
    },
  },
  buttonCancel: {
    borderRadius: "unset",
    width: 245,
    height: 48,
    color: "black",
    backgroundColor: "white !important",
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(2),
    border: "1px solid #000000",
    boxSizing: "border-box",
    "&:hover": {
      backgroundColor: "#1565C0",
    },
    [theme.breakpoints.down("md")]: {
      width: 164,
    },
  },
  buttonTextCancel: {
    fontSize: "14px",
    fontWeight: 700,
    color: "black",
  },
  paper: {
    position: "absolute",
    width: 847,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    outline: "none",
    top: "50%",
    left: "50%",
    maxHeight: "60vh",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    [theme.breakpoints.down("md")]: {
      width: 400,
    },
  },
  title: {
    fontWeight: "bold",
    fontSize: "24px",
    lineHeight: "24px",
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  subTitle: {
    paddingTop: theme.spacing(1),
    fontWeight: 500,
    fontSize: "20px",
    lineHeight: "23px",
  },
  menuIcon: {
    fontSize: "24px",
    marginRight: theme.spacing(1),
  },
}));

const PromptReturnItem = (props) => {
  const classes = useStyles({});
  const {
    buttonClassName,
    textClassName,
    text,
    handleOpenPrompt,
    handleConfirm,
    isExchange,
  } = props;
  const [open, setOpen] = useState(false);
  const [reconfirmModal, setReconfirmModal] = useState(false);
  const PromptReturnItem = () => {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
        keepMounted
      >
        <div className={classes.paper}>
          <Box display="flex" flexDirection="row" justifyContent="end">
            <BaseButton
              onClick={() => handleClose()}
              iconComponent={<CloseIcon className={classes.menuIcon} />}
            />
          </Box>
          <Typography className={classes.title}>
            Confirm to return items?
          </Typography>
          <Typography className={classes.subTitle}>
            Please kindly note that the refund/exchange request <br /> cannot be
            changed once you click the okay button.
          </Typography>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            mt={2}
          >
            <BaseButton
              buttonClassName={classes.buttonCancel}
              text="CANCEL"
              onClick={handleClose}
              textClassName={classes.buttonTextCancel}
            />
            <BaseButton
              buttonClassName={classes.button}
              text="OKAY"
              onClick={handleReconfirmModal}
              textClassName={classes.buttonText}
            />
          </Box>
        </div>
      </Modal>
    );
  };

  const ReconfirmModal = () => {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={reconfirmModal}
        onClose={handleCloseReconfirmModal}
        keepMounted
      >
        <div className={classes.paper}>
          <Box display="flex" flexDirection="row" justifyContent="end">
            <BaseButton
              onClick={() => handleCloseReconfirmModal()}
              iconComponent={<CloseIcon className={classes.menuIcon} />}
            />
          </Box>
          <Typography className={classes.title}>
            We’ve received your request
          </Typography>
          {isExchange ? (
              <Typography className={classes.subTitle}>
              We will get back to you shortly!
              <br />
              There’s a <span style={{ color:"red"}}>$2</span> settlement for your exchange item.
              <br />
              We will send a stripe link to your mobile number to make payment.
              <br />
              Alternatively, you can locate the link under your order ID
              summary.
              <br />
              Thank you for your kind understanding.
            </Typography>
          ) : (
            <Typography className={classes.subTitle}>
              We will get back to you shortly!
              <br /> Thank you for your kind understanding.
            </Typography>
          )}
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            mt={2}
          >
            <BaseButton
              buttonClassName={classes.button}
              text="OKAY"
              textClassName={classes.buttonText}
              onClick={handleCloseReconfirmModal}
            />
          </Box>
        </div>
      </Modal>
    );
  };

  const handleOpen = () => {
    if (handleConfirm()) {
      setOpen(true);
      handleOpenPrompt(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    handleOpenPrompt(true);
  };
  const handleReconfirmModal = () => {
    setOpen(false);
    setReconfirmModal(true);
    handleOpenPrompt(false);
  };

  const handleCloseReconfirmModal = () => {
    setOpen(false);
    setReconfirmModal(false);
    handleOpenPrompt(false);
  };
  return (
    <Box>
      <BaseButton
        buttonClassName={buttonClassName}
        text={text}
        onClick={() => handleOpen()}
        textClassName={textClassName}
      />
      <PromptReturnItem />
      <ReconfirmModal />
    </Box>
  );
};

export default PromptReturnItem;
