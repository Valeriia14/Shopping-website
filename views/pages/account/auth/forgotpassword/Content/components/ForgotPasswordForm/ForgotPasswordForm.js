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
import { formStructure } from "./ForgotPasswordFormConfig";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0, 3),
  },
  signInText: {
    fontSize: "18px",
    fontWeight: 600,
    color: theme.palette.primary.dark,
    marginRight: theme.spacing(2),
  },
  signUpText: {
    fontSize: "18px",
    fontWeight: 600,
    color: theme.palette.primary.dark,
    marginRight: theme.spacing(2),
  },
  forgotPasswordText: {
    fontSize: "18px",
    fontWeight: 600,
    color: theme.palette.primary.dark,
    marginRight: theme.spacing(2),
    paddingBottom: theme.spacing(0.5),
    borderBottom: "3px solid",
  },
  tabWrap: {
    marginBottom: theme.spacing(4)
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

const ForgotPasswordForm = props => {
  const classes = useStyles({});
  const api = useApi();
  const [fields, values, errors] = useFormHandler(formStructure);
  const [runRequestResetPassword, loading, error] = useAsyncTask("requestResetPassword");
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
    runRequestResetPassword(async () => {
      const { email } = values;

      const body = {
        username: email,
      };

      try {
          const result = await api.path("account/request_reset_password").post({ body });
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
      <Box display="flex" flexDirection="row" className={classes.tabWrap}>
        <Link href="/auth/signin" underline="none"><Typography variant="body2" className={classes.signInText}>Sign In</Typography></Link>
        <Link href="/auth/signup" underline="none"><Typography variant="body2" className={classes.signUpText}>Sign Up</Typography></Link>
        <Link href="/auth/forgotpassword" underline="none"><Typography variant="body2" className={classes.forgotPasswordText}>Forgot Password</Typography></Link>
      </Box>
      <BaseInput fields={fields} name="email" type="text" submitError={submitError} required />
      {responseStatus && <GenericMessage success message="Your reset password request was sent!" />}
      <BaseButton onClick={handleSubmit}
        loading={loading}
        buttonClassName={classes.button}
        text="Submit" textClassName={classes.buttonText} />

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

export default ForgotPasswordForm;
