import {
  BaseButton,
  GenericMessage,
  SocialLogin,
  CommonInput,
} from "@ktwebsite/components";
import useApi from "@ktwebsite/utils/api/useApi";
import { ServerErrors } from "@ktwebsite/utils/constants";
import snakeToTitle from "@ktwebsite/utils/snakeToTitle";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { Box, Link, Snackbar, Typography, Grid, FormControlLabel, Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { formStructure } from "./SignInFormConfig";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing("240px", "auto", "120px", "auto"),
    borderTop: "3px solid #000000;",
    textAlign: "center",
    paddingTop: "10px",
    minHeight: "550px",
    minWidth: "335px",
    width: "486px",
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing("120px", "auto", "50px", "auto"),
    },
  },
  forgotPasswordLink: {
    fontSize: "14px",
    color: "black",
    fontWeight: "bold",
  },
  button: {
    width: "100%",
    color: "white",
    borderRadius: "unset",
    backgroundColor: "#1E3A3A",
    padding: "14px",
    marginTop: "30px",
    marginBottom: "20px",
    "&:hover": {
      backgroundColor: "#1565C0",
    },
  },
  buttonSignUp: {
    width: "100%",
    color: "white",
    borderRadius: "unset",
    backgroundColor: "#000000",
    padding: "14px",
    marginTop: "11px",
    marginBottom: "20px",
    "&:hover": {
      backgroundColor: "#1565C0",
    },
  },
  buttonText: {
    fontSize: "16px",
    fontWeight: 600,
    textAlign: "center",
    textTransform: "uppercase"
  },
  successMsg: {
    color: "green",
    fontSize: "14px",
    marginTop: theme.spacing(2),
  },
  orText: {
    textAlign: "center",
    margin: "34px 0px",
    fontWeight: "bold",
    borderBottom: "1px solid #000",
    lineHeight: "0.1em",
    fontFamily:"Cormorant-SemiBold",
    fontSize:"14px"
  },
  title:{
    fontWeight: 600,
    fontSize: "24px",
    fontFamily:"Cormorant-SemiBold"
  },
  titleBox:{
    paddingBottom: "13px",
    borderBottom: "1px solid #000000",
    marginBottom:"26px"
  },
  footerText:{
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "17px",
    textAlign: "center",
    padding: "0px 5px",
    margin: "42px 0px 16px"
  }
}));

const SignInForm = (props) => {
  const classes = useStyles({});
  const api = useApi();
  const [fields, values, errors] = useFormHandler(formStructure);
  const [runSignIn, loading, error] = useAsyncTask("signin");
  const [submitError, setSubmitError] = useState(false);
  const [responseStatus, setResponseStatus] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [formState, setFormState] = useState({});
  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        handleSubmit(event);
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [errors, values]);
  useEffect(() => {
    window.onbeforeunload = function (e) {
      window.onunload = function () {
        localStorage.removeItem("urlAfterSignIn");
      };
      return undefined;
    };
  }, []);
  const handleSubmit = (event) => {
    event && event.preventDefault();
    if (errors) {
      setSubmitError(true);
      setSnackOpen(true);
      setErrorMessage("You need to fill in all required fields!");
      return;
    } else {
      runSignIn(async () => {
        const { email, password } = values;
        const body = {
          username: email,
          password,
          isRemember: formState.values?.isRemember
        };
        try {
          const accessTokenResult = await api
            .path("account/signin")
            .post({ body });
          if (accessTokenResult) {
            setResponseStatus(true);
            document.cookie = `authorization=${
              accessTokenResult.data.result.access.token
            }; expires=${moment
              .unix(accessTokenResult.data.result.access.expires_at)
              .format()}; path=/;`;
            localStorage.setItem(
              "sessionToken",
              accessTokenResult.data.result.access.token
            );
            if (localStorage.getItem("urlAfterSignIn")) {
              doRedirect(localStorage.getItem("urlAfterSignIn"));
              localStorage.removeItem("urlAfterSignIn");
            } else {
              doRedirect("/account/dashboard");
            }
          }
        } catch (error) {
          setSnackOpen(!!error);
          setErrorMessage(
            ServerErrors[error.message] || snakeToTitle(error.message)
          );
        }
      });
    }
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
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));
  };
  return (
    <Grid item className={classes.root} xs={4} md={4} sm={12}>
      <Box mb={2} className={classes.titleBox}>
        <Typography variant="h3" className={classes.title}>Login</Typography>
      </Box>
      <Box>
        <CommonInput fields={fields} />
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
      <FormControlLabel
          control={
            <Checkbox
              name="isRemember"
              color="default"
              onChange={handleChange}
            />
          }
          label={
            <Typography className={classes.forgotPasswordLink}>
              Remember me
            </Typography>
          }
        />
        <Link href="/auth/forgot-password" underline="always">
          <Typography className={classes.forgotPasswordLink}>
            Forgot password?
          </Typography>
        </Link>
      </Box>
      {responseStatus && (
        <GenericMessage success message="Welcome to Kidztime!" />
      )}
      <BaseButton
        onClick={handleSubmit}
        loading={loading}
        buttonClassName={classes.button}
        text="LOG IN"
        textClassName={classes.buttonText}
      />
      <SocialLogin />
      {!loading && (
        <Snackbar
          key={error}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          message={error || errorMessage}
          open={snackOpen}
          autoHideDuration={3000}
          onClose={() => setSnackOpen(false)}
        />
      )}
      <Typography variant="h5" className={classes.orText}>
        <span style={{ background: "#fff", padding: "0 10px" }}>OR</span>
      </Typography>
       <Typography className={classes.footerText}>
       Join KIDZTIME CLUB today to be the first to see news, exclusive deals & earning points. Get 30% for your first purchase!
      </Typography>
      <Link href="/auth/signup" underline="none">
        <BaseButton
          buttonClassName={classes.buttonSignUp}
          text="CREATE AN ACCOUNT"
          textClassName={classes.buttonText}
        />
      </Link>
    </Grid>
  );
};

export default SignInForm;
