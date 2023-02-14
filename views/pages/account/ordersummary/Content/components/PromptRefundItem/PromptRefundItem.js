import {
  Box,
  Typography,
  Grid,
  Snackbar,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment, useEffect, useState } from "react";
import { useSelfAccount } from "@ktwebsite/hooks";
import Modal from "@material-ui/core/Modal";
import { BaseButton, CommonInput } from "@ktwebsite/components";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import { formStructure } from "./ReturnFormConfig";
import PromptReturnItem from "../PromptReturnItem";
import WantReturnItem from "../WantReturnItem";
import PromptProductTable from "../PromptProductTable";
import CloseIcon from "@material-ui/icons/Close";
const useStyles = makeStyles((theme) => ({
  root: {},
  buttonText: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#FFFFFF",
  },
  button: {
    borderRadius: "unset",
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
    marginRight: theme.spacing(4),
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
    maxWidth: "847px",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    outline: "none",
    top: "5%",
    left: "50%",
    maxHeight: "80vh",
    transform: "translate(-50%, 5%)",
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      width: "1px",
    },
    [theme.breakpoints.down("md")]: {
      minWidth: 400,
      top: "unset",
      maxHeight: "90vh",
    },
  },
  title: {
    fontWeight: "bold",
    fontSize: "30px",
    lineHeight: "24px",
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    [theme.breakpoints.down("md")]: {
      fontSize: "24px",
    },
  },
  subTitle: {
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: "19px",
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down("md")]: {
      marginBottom: theme.spacing(2),
    },
  },
  descriptionText: {
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "20px",
    [theme.breakpoints.down("md")]: {
      fontSize: "12px",
    },
  },
  checkbox: {
    color: "#ccc",
    "&.Mui-checked": {
      color: "#000000",
    },
  },
  menuIcon: {
    fontSize: "24px",
    marginRight: theme.spacing(1),
  },
}));

const PromptRefundItem = (props) => {
  const classes = useStyles({});
  const [open, setOpen] = useState(false);
  const [fields, values, errors] = useFormHandler(formStructure?.form);
  const [othersFields, others] = useFormHandler(formStructure?.others);
  const [formState, setFormState] = useState({});
  const [errorMessage, setErrorMessage] = useState();
  const [snackOpen, setSnackOpen] = useState(false);
  const { itemData, key } = props;
  const checkBoxList = [
    { name: "Change of mind", value: "change_of_mind" },
    { name: "Poor Quality ", value: "poor_quality" },
    {
      name: "Item doesn’t match description or image",
      value: "item_not_match_description_or_image",
    },
    { name: "Wrong sizes", value: "wrong_sizes" },
    { name: "Others", value: "others" },
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    event.persist();
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      },
    }));
  };

  const handleConfirm = (event) => {
    event && event.preventDefault();
    if (errors) {
      setSnackOpen(true);
      setErrorMessage("You need to fill in all required fields!");
      return;
    } else {
      return true;
    }
  };

  return (
    <Box className={classes.root} key={key}>
      <BaseButton
        buttonClassName={props.buttonClassName}
        text="REFUND"
        textClassName={props.textClassName}
        onClick={() => {
          handleOpen();
        }}
        disabled={props.disabled}
      />
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
          <WantReturnItem />
          <Box mt={4}>
            <Typography variant="h2" className={classes.title}>
              KINDLY FILL UP THIS RETURN FORM
            </Typography>
            <Typography className={classes.subTitle}>
              Our representative will get in touch with you shortly
            </Typography>
            <CommonInput fields={fields} />
            <PromptProductTable label="Refund" item={itemData} />
          </Box>
          <Box mt={4}>
            <Typography className={classes.title}>
              REASON FOR RETURNING ITEMS
            </Typography>
            <Grid container>
              {checkBoxList.map((item, index) => {
                return (
                  <Grid item lg={6} xs={6} md={6} sm={6} key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={item.value}
                          className={classes.checkbox}
                          color="default"
                          onChange={handleChange}
                        />
                      }
                      label={
                        <Typography className={classes.descriptionText}>
                          {item.name}
                        </Typography>
                      }
                    />
                  </Grid>
                );
              })}
              {formState.values?.others && (
                <Grid item lg={12} xs={12} md={12} sm={12}>
                  <CommonInput fields={othersFields} />
                </Grid>
              )}
            </Grid>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            mt={2}
          >
            <BaseButton
              buttonClassName={classes.buttonCancel}
              text="CANCEL"
              onClick={() => handleClose()}
              textClassName={classes.buttonTextCancel}
            />
            <PromptReturnItem
              buttonClassName={classes.button}
              text="CONFIRM"
              textClassName={classes.buttonText}
              handleOpenPrompt={setOpen}
              handleConfirm={handleConfirm}
            />
          </Box>
        </div>
      </Modal>
      {errorMessage && (
        <Snackbar
          key={errorMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          message={errorMessage}
          open={snackOpen}
          autoHideDuration={3000}
          onClose={() => setSnackOpen(false)}
        />
      )}
    </Box>
  );
};

export default PromptRefundItem;
