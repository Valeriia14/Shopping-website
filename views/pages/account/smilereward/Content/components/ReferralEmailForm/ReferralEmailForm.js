import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { BaseButton, BaseInput } from "@ktwebsite/components";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import { formStructure } from "./ReferralEmailFormConfig";

const useStyles = makeStyles((theme) => ({
  sendBtn: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    background: theme.palette.primary.main,
    borderRadius: "33px",
    height: "40px",
    marginTop: theme.spacing(2),
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  sendBtnText: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600"
  }
}));

const ReferralEmailForm = props => {

  const [fields, values, errors] = useFormHandler(formStructure);

  const classes = useStyles({});

  return (
    <>
      <Grid container item xs={12}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Option 2: Send an invite via email</Typography>
        </Grid>
        <Grid item xs={12}>
          <BaseInput fields={fields} name="email" type="text" required />
          <BaseInput fields={fields} name="message" type="text" multiline={true} rows={5} />
        </Grid>
        <Grid item xs={12}>
          <BaseButton
            buttonClassName={classes.sendBtn}
            text="Send Request" textClassName={classes.sendBtnText} />
        </Grid>
      </Grid>
    </>
  );
};

export default ReferralEmailForm;
