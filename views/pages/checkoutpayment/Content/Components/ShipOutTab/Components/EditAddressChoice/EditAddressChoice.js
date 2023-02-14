import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Hidden,
  makeStyles,
  Typography,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import AddIcon from "@material-ui/icons/Add";
import { StickyActionBox } from "@ktwebsite/components";

const useStyles = makeStyles((theme) => ({
  shippingCardBox: {
    minHeight: 150,
    border: "1px solid #cdcbcb",
    margin: 8,
    borderRadius: 9,
    display: "flex",
    padding: "40px 30px",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      margin: "8px 0px",
    },
  },
  shippingCardBoxActive: {
    minHeight: 150,
    border: "1px solid #1E3A3A",
    margin: 8,
    borderRadius: 9,
    display: "flex",
    padding: "40px 30px",
    position: "relative",
    "& #cardActive": {
      display: "flex!important",
    },
    [theme.breakpoints.down("xs")]: {
      margin: "8px 0px",
    },
  },
  cardActive: {
    top: "-12px",
    right: "-12px",
    border: "1px solid #00000000",
    display: "none",
    position: "absolute",
    borderRadius: "25px",
    backgroundColor: "#65B854",
    "& svg": {
      fill: "white",
    },
  },
  ediButton: {
    position: "absolute",
    padding: 4,
    minWidth: "fit-content",
    right: "8px",
    bottom: "8px",
    borderRadius: 25,
  },
  addAddressButtonBox: {
    minHeight: 150,
    margin: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  addAddressButton: {
    margin: 8,
    height: "fit-content",
    borderBottom: "1px solid",
  },
  addnewbuttonBox: {
    height: "193px",
    margin: 8,
    backgroundColor: "#bcbcbc",
    borderRadius: 5,
    display: "flex",
    padding: "40px 30px",
    [theme.breakpoints.down("xs")]: {
      margin: "8px 0px",
    },
  },
  addButton: {
    width: "100%",
    textTransform: "none",
  },
  buttonBox: {
    display: "flex",
    marginTop: 16,
    [theme.breakpoints.down("xs")]: {
      margin: "16px 0",
      justifyContent: "space-between",
    },
  },
  cancelButton: {
    minWidth: 150,
    height: 48,
    fontSize: "18px",
    fontFamily: "Barlow-medium",
    borderRadius: 0,
    border: "1px solid black",
    marginRight: 16,
    padding: "8px 48px",
    [theme.breakpoints.down("xs")]: {
      padding: "8px 16px",
      margin: 0,
    },
  },
  saveButton: {
    minWidth: 150,
    marginRight: 16,
    height: 48,
    fontSize: "18px",
    fontFamily: "Barlow-medium",
    borderRadius: 0,
    color: "white",
    backgroundColor: "black",
    padding: "8px 48px",
    "&:hover": {
      backgroundColor: "black",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "8px 16px",
      margin: 0,
    },
  },
  typeText: {
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: "19px",
    textAlign: "left",
    textTransform: "uppercase",
  },
  infoText: {
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "19px",
    textAlign: "left",
  },
}));

const EditAddressChoice = (props) => {
  const {
    setOpenCreateAddress,
    addressList,
    setEditSelection,
    setIsSelectAddress,
  } = props;
  const classes = useStyles();
  let addressSelected = JSON.parse(
    sessionStorage.getItem("billingAddressSelected")
  ); //eslint-disable-line
  const [selected, setSelected] = useState(null);

  const setNameCustomer = useCallback((item) => {
    let firstName = item?.firstname ? item?.firstname : "-";
    let lastName = item?.lastname ? item?.lastname : "";
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    return firstName + " " + lastName;
  }, []); // eslint-disable-line

  const hanldeChoiceAddress = (item) => {
    setSelected(item);
  };
  const showContent = () => {
    return addressList.map((item, index) => {
      return (
        <Grid
          key={index}
          item
          xs={12}
          sm={6}
          onClick={() => hanldeChoiceAddress(item)}
        >
          <Box
            className={
              item?.id === (selected?.id || addressSelected?.id)
                ? classes.shippingCardBoxActive
                : classes.shippingCardBox
            }
          >
            <Box display="flex" flexDirection="column" width="100%">
              <Typography className={classes.typeText}>
                {item?.type || "-"}
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                margin="16px 0 0 0"
              >
                <Typography className={classes.infoText}>
                  {setNameCustomer(item)}
                </Typography>
                <Typography className={classes.infoText}>
                  {item?.contact_number || "-"}
                </Typography>
              </Box>
              <Typography className={classes.infoText}>
                {item?.street_address || "-"}
              </Typography>
              <Typography className={classes.infoText}>
                {"#" +
                  item?.unit_no.slice(0, 2) +
                  "-" +
                  item?.unit_no.slice(2, 4) || "-"}
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography className={classes.infoText}>
                  {item?.country || "-"}
                </Typography>
                <Typography className={classes.infoText}>
                  {item?.postal_code || "-"}
                </Typography>
              </Box>
            </Box>
            <Box id="cardActive" className={classes.cardActive}>
              <CheckIcon />
            </Box>
            <Button
              className={classes.ediButton}
              onClick={() => {
                sessionStorage.setItem(
                  "editAddress",
                  JSON.stringify({
                    address: item,
                    title: "EDIT BILLING ADDRESS",
                  })
                );
                setOpenCreateAddress(true);
              }}
            >
              <img src="images/Edit_icon.svg" alt="Edit" />
            </Button>
          </Box>
        </Grid>
      );
    });
  };
  return (
    <Box>
      <Grid container>{showContent()}</Grid>
      <Hidden xsDown={true}>
        <Box className={classes.buttonBox}>
          <Button
            className={classes.cancelButton}
            onClick={() => setEditSelection(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              sessionStorage.setItem(
                "billingAddressSelected",
                JSON.stringify(selected)
              );
              setEditSelection(false);
              setIsSelectAddress(true);
            }}
            className={classes.saveButton}
          >
            Confirm
          </Button>
        </Box>
      </Hidden>
      <Hidden smUp={true}>
        <StickyActionBox zIndex={3}>
          <Button
            className={classes.cancelButton}
            onClick={() => setEditSelection(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              sessionStorage.setItem(
                "billingAddressSelected",
                JSON.stringify(selected)
              );
              setEditSelection(false);
              setIsSelectAddress(true);
            }}
            className={classes.saveButton}
          >
            Confirm
          </Button>
        </StickyActionBox>
      </Hidden>
    </Box>
  );
};

export default EditAddressChoice;
