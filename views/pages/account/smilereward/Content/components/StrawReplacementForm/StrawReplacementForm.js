import { Grid, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { Fragment } from "react";
import { BaseButton, BaseInput } from "@ktwebsite/components";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import { formStructure } from "./StrawReplacementFormConfig";

const useStyles = makeStyles((theme) => ({
  DeliveryAddress: {
    paddingRight: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      paddingRight: theme.spacing(0),
    }
  },
  PostalCode: {
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      paddingLeft: theme.spacing(0),
    }
  },
  ReplacementTypeWrap: {
    borderRadius: "20px",
    border: "4px solid #979797",
    paddingTop: theme.spacing(1.5),
    width: "120px",
    height: "120px",
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      width: "90px",
      height: "90px",
    }
  },
  ReplacementTypeImg: {
    width: "112px",
    height: "112px",
    objectFit: "contain",
    [theme.breakpoints.down("xs")]: {
      width: "82px",
      height: "82px",
    }
  },
  replacementTypeTextWrap: {
    background: "#000",
    opacity: 0.0,
    width: "112px",
    height: "112px",
    position: "absolute",
    marginTop: theme.spacing(-1.5),
    borderRadius: "15px",
    cursor: "pointer",
    [theme.breakpoints.down("xs")]: {
      width: "82px",
      height: "82px",
    },
    "&:hover": {
      opacity: 0.6
    },
  },
  replacementTypeText: {
    color: "#fff",
    fontSize: "14px",
    textAlign: "center",
    fontWeight: "600",
    marginTop: theme.spacing(3)
  },
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

const StrawReplacementForm = props => {

  const [fields, values, errors] = useFormHandler(formStructure);

  const classes = useStyles({});

  return (
    <Fragment>
      <Grid container item xs={12}>
        <Grid item sm={6} xs={12}>
          <BaseInput fields={fields} name="delivery_address" type="text" className={classes.DeliveryAddress} required />
        </Grid>
        <Grid item sm={6} xs={12}>
          <BaseInput fields={fields} name="postal_code" type="text" className={classes.PostalCode} required />
        </Grid>
        <Grid item xs={12}>
          <BaseInput fields={fields} name="remarks" type="number" required multiline={true} rows={5} />
        </Grid>
      </Grid>
      <Box display="flex" flexDirection="row">
        <Box className={classes.ReplacementTypeWrap}>
          <Box className={classes.replacementTypeTextWrap}>
            <Typography className={classes.replacementTypeText}>Sipper Cap (small)</Typography>
          </Box>
          <img src="/images/sipper-cap-small.png" className={classes.ReplacementTypeImg} />
        </Box>
        <Box className={classes.ReplacementTypeWrap} ml={1}>
          <Box className={classes.replacementTypeTextWrap}>
            <Typography className={classes.replacementTypeText}>Sipper Cap (Large)</Typography>
          </Box>
          <img src="/images/sipper-cap-large.png" className={classes.ReplacementTypeImg} />
        </Box>
        <Box className={classes.ReplacementTypeWrap} ml={1}>
          <Box className={classes.replacementTypeTextWrap}>
            <Typography className={classes.replacementTypeText}>Sports Sipper</Typography>
          </Box>
          <img src="/images/sports-sipper.png" className={classes.ReplacementTypeImg} />
        </Box>
      </Box>
      <BaseButton
        buttonClassName={classes.sendBtn}
        text="Send Request" textClassName={classes.sendBtnText} />
    </Fragment>
  );
};

export default StrawReplacementForm;
