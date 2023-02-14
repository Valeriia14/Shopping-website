import { BaseButton, BaseInput, GenericMessage } from "@ktwebsite/components";
import useApi from "@ktwebsite/utils/api/useApi";
import { ServerErrors } from "@ktwebsite/utils/constants";
import snakeToTitle from "@ktwebsite/utils/snakeToTitle";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { Box, Link, Snackbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import React, { useState } from "react";
import { formStructure } from "./ResetPasswordFormConfig";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0, 3),
  },
  button: {
    width: "100%",
    backgroundColor: "#067dff",
    color: "white",
    marginTop: theme.spacing(5),
    borderRadius: "6px",
    padding: theme.spacing(1),
    "&:hover": {
      backgroundColor: "#1565C0",
    },
  },
  buttonText: {
    fontSize: "14px",
    fontWeight: 700
  },
  successMsg: {
    color: "green",
    fontSize: "14px",
    marginTop: theme.spacing(2)
  }
}));

const ResetPasswordForm = props => {
  const classes = useStyles({});
  const api = useApi();
  const [fields, values, errors] = useFormHandler(formStructure);
  const [runResetPassword, loading, error] = useAsyncTask("resetPassword");
  const [submitError, setSubmitError] = useState(false);
  const [responseStatus, setResponseStatus] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const handleSubmit = (event) => {
    event && event.preventDefault();
    if (errors) {
      setSubmitError(true);
      return;
    }
    runResetPassword(async () => {
      const { password } = values;
      const params = new URLSearchParams(window.location.search);
      let token = params.get('token');

      const body = {
        token: token,
        password: password,
      };

      try {
          const result = await api.path("account/reset_password").post({ body });
          if (result) {
            setResponseStatus(true);
          }
        } catch (error) {
          setSnackOpen(!!error);
          setErrorMessage(ServerErrors[error.message] || snakeToTitle(error.message));
        }
    })
  };

  return (
    <Box className={classes.root}>
      <BaseInput fields={fields} name="password" type="password" submitError={submitError} required />
      <BaseInput fields={fields} name="confirm_password" type="password" submitError={submitError} required />

      {responseStatus && <GenericMessage success message="Your password has been reset!" />}
      <BaseButton onClick={handleSubmit}
        loading={loading}
        buttonClassName={classes.button}
        text="Confirm new password" textClassName={classes.buttonText} />

        {!loading && (
          <Snackbar
            key={error}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            message={error || errorMessage}
            open={snackOpen}
            autoHideDuration={3000}
            onClose={() => setSnackOpen(false)}
        />)}
    </Box>
  );
};

export default ResetPasswordForm;
