import { Box, Snackbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment, useState, useEffect } from "react";
import BaseButton from "../BaseButton";
import { GoogleLogin } from "react-google-login";
import configDev from "@ktwebsite/utils/config/config.dev";
import useApi from "@ktwebsite/utils/api/useApi";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import doRedirect from "@ktwebsite/utils/doRedirect";
import moment from "moment";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const useStyles = makeStyles((theme) => ({
  socialButton: {
    width: "49%",
    color: "black",
    padding: theme.spacing(1, 2),
    backgroundColor: "white",
    borderRadius: "unset",
  },
  socialButtonText: {
    fontSize: "14px",
    textTransform: "none",
    marginLeft: theme.spacing(0.5),
    fontWeight: 500,
  },
  icon: {
    marginRight: "5px",
  },
}));

const SocialLogin = (props) => {
  const classes = useStyles();
  const api = useApi();
  const [snackOpen, setSnackOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [runSignIn, loading, error] = useAsyncTask("signin-social");
  useEffect(() => {
    window.onbeforeunload = function (e) {
      window.onunload = function () {
        localStorage.removeItem("urlAfterSignIn");
      };
      return undefined;
    };
  }, []);

  const login = (accessTokenResult) => {
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
  };

  const responseGoogle = (response) => {
    const { profileObj } = response;
    if (profileObj) {
      runSignIn(async () => {
        const body = {
          type: "google",
          data: profileObj,
        };
        try {
          const accessTokenResult = await api
            .path("account/login-social")
            .post({ body });
          if (accessTokenResult) {
            login(accessTokenResult);
          } else {
            setSnackOpen(true);
            setErrorMessage("Sign in failed. Please try again");
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

  const responseFacebook = (response) => {
    if (response && response.userID) {
      runSignIn(async () => {
        const body = {
          type: "facebook",
          data: response,
        };
        try {
          const accessTokenResult = await api
            .path("account/login-social")
            .post({ body });
          if (accessTokenResult) {
            login(accessTokenResult);
          } else {
            setSnackOpen(true);
            setErrorMessage("Sign in failed. Please try again");
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
  return (
    <Fragment>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <FacebookLogin
          appId={configDev.facebook_app_id}
          callback={responseFacebook}
          render={(renderProps) => (
            <BaseButton
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              buttonVariant="outlined"
              buttonClassName={classes.socialButton}
              text="FACEBOOK"
              textClassName={classes.socialButtonText}
              fields="name,email,picture"
              iconComponent={
                <img
                  src="/images/FB_icon.svg"
                  className={classes.icon}
                />
              }
            />
          )}
        />
        <GoogleLogin
          clientId={configDev.google_client_id}
          render={(renderProps) => (
            <BaseButton
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              buttonVariant="outlined"
              buttonClassName={classes.socialButton}
              text="GOOGLE"
              textClassName={classes.socialButtonText}
              iconComponent={
                <img
                  src="/images/Google_icon.svg"
                  className={classes.icon}
                />
              }
            />
          )}
          buttonText="Login"
          onSuccess={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      </Box>
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
    </Fragment>
  );
};

export default SocialLogin;
