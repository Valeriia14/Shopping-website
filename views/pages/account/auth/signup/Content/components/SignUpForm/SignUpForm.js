import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
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
import { formStructure } from "./SignUpFormConfig";
import doRedirect from "@ktwebsite/utils/doRedirect";

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
}));

const SignUpForm = (props) => {
  const classes = useStyles({});
  const [fields, values, errors] = useFormHandler(formStructure);
  const api = useApi();
  const [runSignUp, loading, error] = useAsyncTask("signup");
  const [submitError, setSubmitError] = useState(false);
  const [responseStatus, setResponseStatus] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [formState, setFormState] = useState({});

  useEffect(() => {
    let mounted = true;
    return () => (mounted = false);
  }, []);

  const handleSubmit = (event) => {
    event && event.preventDefault();

    if (errors) {
      setSubmitError(true);
      return;
    }
    runSignUp(async () => {
      const {
        email_address,
        password,
        firstname,
        lastname,
        phone_number,
        country_code,
      } = values;
      const body = {
        user: {
          email_address,
          password,
          firstname,
          lastname,
          phone_number: country_code + " " + phone_number,
          emailSubscribers: formState.values?.emailSubscribers
        },
      };
      try {
        const response = await api.path("account/signup").post({ body });
        if (response) {
          setResponseStatus(true);
          doRedirect("/auth/signin");
        }
      } catch (error) {
        setSnackOpen(!!error);
        setErrorMessage(
          ServerErrors[error.message] || snakeToTitle(error.message)
        );
      }
    });
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
        <Typography variant="h3" align="center" className={classes.title}>
          Create An Account
        </Typography>
      </Box>
      <Box>
        <CommonInput fields={fields} />
      </Box>
      <Box display="flex">
        <FormControlLabel
          control={
            <Checkbox
              name="emailSubscribers"
              color="default"
              onChange={handleChange}
            />
          }
          label={
            <Typography variant="h5">
              I would like to receive notification from Kidztime
            </Typography>
          }
        />
      </Box>
      {responseStatus && (
        <GenericMessage
          success
          message="Thank You For Signing Up With Kidztime!"
        />
      )}
      <BaseButton
        onClick={handleSubmit}
        loading={loading}
        buttonClassName={classes.button}
        text="REGISTER"
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
      <Link href="/auth/signin" underline="none">
        <BaseButton
          buttonClassName={classes.buttonSignUp}
          text="LOG IN"
          textClassName={classes.buttonText}
        />
      </Link>
    </Grid>
  );
};

export default SignUpForm;
