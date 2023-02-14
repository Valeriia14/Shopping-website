import { Box, Checkbox, FormControlLabel, Grid, Typography, Snackbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { BaseButton, BaseInput } from "@ktwebsite/components";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import { formStructure } from "./ContactFormConfig";
import useApi from "@ktwebsite/utils/api/useApi";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import { useSnackbar } from "notistack";


const useStyles = makeStyles((theme) => ({
  contactWrap: {
    marginLeft: theme.spacing(3)
  },
  submitBtn: {
    width: "120px",
    backgroundColor: "#2d2866",
    color: "white",
    marginTop: theme.spacing(1),
    borderRadius: "30px",
    padding: theme.spacing(1),
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  emailCheckbox: {
    color: "#ccc",
  },
  emailText: {
    fontWeight: 600,
    fontSize: "14px",
  },
  submitBtnText: {
    fontSize: "14px",
    fontWeight: 700
  },
  AccountContactLeft: {
    paddingRight: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      paddingRight: theme.spacing(0),
    }
  },
  AccountContactRight: {
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      paddingLeft: theme.spacing(0),
    }
  },
}));

const ContactForm = props => {
  const classes = useStyles({});
  const api = useApi();

  const [fields, values, errors, clearForm] = useFormHandler(formStructure);
  const [submitError, setSubmitError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [runSendContactMail, loading, error] = useAsyncTask("sendContactMail");


  const handleSubmit = (event) => {
    event && event.preventDefault();

    runSendContactMail(async () => {
      if (errors !== undefined) {
        setSubmitError(errors);
        return
      }

      const { email } = values;
      const body = values;
      try {
        await api.path("public/send_contact_mail").post({ body });
        clearForm();
        enqueueSnackbar("Your message has been sent!", { variant: "success" });
      } catch (error) {
        enqueueSnackbar("Something went wrong. We could not send your message :(", { variant: "error" });
      }
    })
  };

  return (
    <Grid container item xs={11} className={classes.contactWrap}>
      <Grid item xs={12}>
        <Typography variant="body2">Have a question or feedback regarding our products, service or just about anything? Feel free to contact us via our contact form. We will get back to you as soon as possible :)</Typography>
      </Grid>
      <Grid container item xs={12} >
        <Grid item sm={6} xs={12} className={classes.AccountContactLeft}>
          <BaseInput fields={fields} submitError={submitError} name="first_name" type="text" required />
        </Grid>
        <Grid item sm={6} xs={12} className={classes.AccountContactRight}>
          <BaseInput fields={fields} submitError={submitError} name="last_name" type="text" required />
        </Grid>
        <Grid item sm={6} xs={12} className={classes.AccountContactLeft}>
          <BaseInput fields={fields} submitError={submitError} name="customer_email" type="text" required />
        </Grid>
        <Grid item sm={6} xs={12} className={classes.AccountContactRight}>
          <BaseInput fields={fields} submitError={submitError} name="phone" type="number" required />
        </Grid>
        <Grid item xs={12}>
          <BaseInput fields={fields} submitError={submitError} name="remarks" type="number" required multiline={true} rows={5} />
        </Grid>
      </Grid>
      <Box>
        <Typography className={classes.emailText}>Email Preference</Typography>
        <Box>
          <FormControlLabel control={<Checkbox name="emailCheck" className={classes.emailCheckbox} />}
            label={
              <Typography variant="h5">
                We’ll keep you updated on special offers, new launches and more
            </Typography>
            }
          />
        </Box>
        <BaseButton
          onClick={handleSubmit}
          buttonClassName={classes.submitBtn}
          text="Submit" textClassName={classes.submitBtnText}
          loading={loading}
        />
      </Box>
    </Grid>
  );
};

export default ContactForm;
