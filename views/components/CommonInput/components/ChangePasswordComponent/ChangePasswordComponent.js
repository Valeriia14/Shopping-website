import {
  Box,
  Button,
  Fade,
  Grid,
  makeStyles,
  Modal,
  Typography,
} from "@material-ui/core";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { TextPassword } from "..";
import { useStyles } from "../../styles";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import { formStructure } from "./configForm";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import { useSnackbar } from "notistack";
import useApi from "@ktwebsite/utils/api/useApi";
import { useSelfAccount } from "@ktwebsite/hooks";

const useStylesPrimary = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  button: {
    paddingLeft: "28px",
    fontSize: "14px",
    textAlign: "left",
    fontWeight: 700,
    lineHeight: "16px",
    textTransform: "none",
    textDecoration: "underline",
    cursor: "pointer",
    [theme.breakpoints.down("xs")]: {
      padding: "8px 0px",
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: 530,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 50,
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      padding: "42px 24px",
      boxSizing: "border-box",
    },
  },
  textHeader: {
    fontSize: "24px",
    fontWeight: 700,
    lineHeight: "28px",
    textAlign: "left",
    marginBottom: 24,
  },
  cancelButton: {
    width: 245,
    fontSize: "24px",
    fontWeight: 500,
    lineHeight: "28px",
    textAlign: "center",
    margin: "0 7px",
    border: "1px solid black",
    borderRadius: 0,
  },
  confirmButton: {
    width: 245,
    fontSize: "24px",
    fontWeight: 500,
    lineHeight: "28px",
    textAlign: "center",
    color: "white",
    margin: "0 7px",
    borderRadius: 0,
    backgroundColor: "black",
    "&:hover": {
      color: "white",
      backgroundColor: "black",
    },
  },
}));

const ChangePasswordComponent = (props) => {
  const classes = useStylesPrimary();
  const classesField = useStyles();
  // const { fields } = props;
  const [changePassword, loading, errorChange] = useAsyncTask("changePassword");
  const api = useApi();
  const [fields, inputs, errors, setInputs, clearForm, setErrors, setDirtys] =
    useFormHandler(formStructure);
  const { enqueueSnackbar } = useSnackbar();
  const self = useSelfAccount();
  const [showPassword, setShowPassword] = useState({});
  const [openModel, setOpenModel] = useState(false);

  useEffect(() => {
    if (openModel) {
      clearForm();
    }
  }, [openModel]);

  const showContent = (field) => {
    switch (field?.spec?.type) {
      case "textPassword":
        return (
          <TextPassword
            classes={classesField}
            field={field}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        );
      default:
        return "";
    }
  };

  const handleToggle = () => {
    setOpenModel(!openModel);
  };
  const handleUpdate = useCallback(() => {
    if (errors) {
      setDirtys(errors);
      enqueueSnackbar(
        "Something went wrong. We could not update your password :(",
        { variant: "error" }
      );
    } else {
      changePassword(async () => {
        try {
          const body = {
            current_password: inputs.current_password,
            new_password: inputs.new_password,
          };
          const response = await api
            .path("public/change_password", { account_id: self?.id })
            .post({
              body,
            });
          enqueueSnackbar("Your password has been updated!", {
            variant: "success",
          });
          handleToggle();
        } catch (error) {
          if (error.message === "Password is incorrect !") {
            setErrors({
              ...errors,
              current_password: ["Password is incorrect!"],
            });
            setDirtys({
              ...errors,
              current_password: ["Password is incorrect!"],
            });
            enqueueSnackbar("Password is incorrect. Please try again!", {
              variant: "error",
            });
          } else {
            enqueueSnackbar(error.message, {
              variant: "error",
            });
          }
        }
      });
    }
  }, [errors, inputs, self, errorChange]);

  return (
    <Fragment>
      <Box className={classes.root}>
        <Typography onClick={handleToggle} className={classes.button}>
          Change password
        </Typography>
      </Box>
      <Modal
        open={openModel}
        className={classes.modal}
        onClose={handleToggle}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Fade in={openModel}>
          <Box className={classes.paper}>
            <Typography className={classes.textHeader}>
              CHANGE PASSWORD
            </Typography>
            <Box>
              <Grid container>
                {fields?.map((field, index) => {
                  return (
                    <Grid
                      key={index}
                      xs={
                        field?.spec?.widthonlyxs ||
                        field?.spec?.widthxs ||
                        field?.spec?.width * 2 ||
                        field?.spec?.fullWidth ||
                        12
                      }
                      sm={
                        field?.spec?.widthxs ||
                        field?.spec?.width ||
                        field?.spec?.fullWidth ||
                        6
                      }
                      item
                    >
                      {showContent(field)}
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={6}
            >
              <Button onClick={handleToggle} className={classes.cancelButton}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} className={classes.confirmButton}>
                Confirm
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Fragment>
  );
};
export default ChangePasswordComponent;
