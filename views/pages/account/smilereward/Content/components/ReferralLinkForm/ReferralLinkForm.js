import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment } from "react";
import { BaseButton, BaseInput } from "@ktwebsite/components";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import { formStructure } from "./ReferralLinkFormConfig";

const useStyles = makeStyles((theme) => ({
  referralInput: {
    width: "70%"
  },
  copyBtn: {
    backgroundColor: "#2d2866",
    height: "40px",
    borderRadius: "33px",
    marginTop: "45px;",
    width: "100px",
    marginLeft: "-20px"
  },
  copyBtnText: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
  }
}));

const ReferralEmailForm = props => {

  const classes = useStyles({});
  const [fields, values, errors] = useFormHandler(formStructure);

  return (
    <Fragment>
      <Grid container item xs={12}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Option 1: Use your personal link</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" flexDirection="row">
            <BaseInput fields={fields} name="personal_link" type="text" className={classes.referralInput} />
            <BaseButton
              buttonClassName={classes.copyBtn}
              text="Copy" textClassName={classes.copyBtnText} />
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default ReferralEmailForm;
