import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import useFormHandler from "@ktwebsite/utils/useFormHandler";
import { CommonInput } from "@ktwebsite/components";
import useAsyncTask from "@ktwebsite/utils/useAsyncTask";
import { formStructure } from "./configForm";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";
import useApi from "@ktwebsite/utils/api/useApi";
import doRedirect from "@ktwebsite/utils/doRedirect";
import { useSelfAccount } from "@ktwebsite/hooks";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      width: "100%",
    },
  },
  textCapitalize: {
    textTransform: "capitalize",
    fontSize: "30px",
    fontWeight: 700,
    lineHeight: "35px",
    textAlign: "left",
    marginBottom: 8,
    [theme.breakpoints.down("sm")]: {
      fontSize: "24px",
      lineHeight: "28px",
    },
  },
  textEarnPoint: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "19px",
    textAlign: "left",
  },
  textInform: {
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: "16px",
    textAlign: "left",
  },
  formControlLabel: {
    "& .MuiFormControlLabel-label": {
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: "14px",
      textAlign: "left",
      [theme.breakpoints.down("xs")]: {
        lineHeight: "20px",
        marginTop: 16,
      },
    },
  },
  icon: {
    color: "#1E3A3A!important",
  },
  updateButton: {
    backgroundColor: "black",
    color: "white",
    width: "245px",
    padding: "14px",
    borderRadius: "0px",
    fontSize: "18px",
    fontWeight: 500,
    lineHeight: "21px",
    textAlign: "center",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
    },
  },
  inputRoot: {
    color: "rgba(0, 0, 0, 0.54)",
  },
}));

const ProfileBody = () => {
  const classes = useStyles();
  const self = useSelfAccount();
  const [reload, setReload] = useState(false);
  const [getProfile, loading, error] = useAsyncTask("getProfile");
  const [uppdatePofile, errorUpdate] = useAsyncTask("updateProfile");
  const { enqueueSnackbar } = useSnackbar();
  const api = useApi();

  const formStructureStandar = React.useMemo(() => {
    if (self?.google_id || self?.facebook_id) {
      const value = Object.keys(formStructure).reduce((acc, key) => {
        if (key !== "divider") {
          acc[key] = formStructure[key];
          return acc;
        } else {
          return acc;
        }
      }, {});
      return value;
    } else {
      return formStructure
    }
  }, [formStructure]);
  const [fields, inputs, errors, setInputs] =
    useFormHandler(formStructureStandar);

  useEffect(() => {
    if (!self) doRedirect("/auth/signin");

    getProfile(async () => {
      const sessionToken = localStorage.getItem("sessionToken");
      if (sessionToken) {
        const response = await api.path("account/profile").get({
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
        let profileRes = response?.data?.result ? response?.data?.result : {};
        let initialProfile = Object.keys(formStructureStandar).reduce((acc, key) => {
          switch (key) {
            case "first_name":
              acc["first_name"] = profileRes["firstname"];
              return acc;
            case "last_name":
              acc["last_name"] = profileRes["lastname"];
              return acc;
            case "country_code":
              acc["country_code"] = profileRes["phone_number"].split(" ")[0];
              return acc;
            case "phone_number":
              acc["phone_number"] = profileRes["phone_number"].split(" ")[1];
              return acc;
            default:
              acc[key] = formStructureStandar?.initialValue || profileRes[key];
              return acc;
          }
        }, {});
        setInputs(initialProfile);
      }
    });
  }, [reload]);

  const handleUpdate = useCallback(() => {
    uppdatePofile(async () => {
      try {
        const body = {
          date_of_birth: inputs?.date_of_birth,
          email_address: inputs?.email_address,
          firstname: inputs?.first_name,
          lastname: inputs?.last_name,
          phone_number: `${inputs?.country_code} ${inputs?.phone_number}`,
        };
        const response = await api.path("public/profile").put({
          body,
        });
        enqueueSnackbar("Your profile has been updated!", {
          variant: "success",
        });
      } catch (error) {
        enqueueSnackbar(
          "Something went wrong. We could not update your profile :(",
          { variant: "error" }
        );
      }
    });
  }, [inputs]);
  const CheckboxCustom = (props) => {
    return (
      <Checkbox
        {...props}
        color="default"
        classes={{
          root: classes.inputRoot,
          checked: classes.checked,
        }}
        className={classes.checkBox}
        icon={<CheckBoxOutlineBlankOutlinedIcon className={classes.icon} />}
        checkedIcon={<CheckBoxOutlinedIcon className={classes.icon} />}
      />
    );
  };

  return (
    <Fragment>
      <Box className={classes.root}>
        <Box pb={3}>
          <Typography className={classes.textCapitalize}>PROFILE</Typography>
          <Typography className={classes.textEarnPoint}>
            Earn +50 point for completing your profile
          </Typography>
        </Box>
        <Box>
          <CommonInput fields={fields} />
        </Box>
        <Box pt={3}>
          <Typography className={classes.textInform}>
            Would you like to receive updates through SMS
          </Typography>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormGroup>
              <FormControlLabel
                className={classes.formControlLabel}
                control={<CheckboxCustom name="Boy" />}
                label="Yes, i would like to receive notification via text messages"
              />
            </FormGroup>
          </FormControl>
        </Box>
        <Box pt={3}>
          <Button onClick={handleUpdate} className={classes.updateButton}>
            Update
          </Button>
        </Box>
      </Box>
    </Fragment>
  );
};

export default ProfileBody;
