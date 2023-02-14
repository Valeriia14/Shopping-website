import React, { useCallback, useEffect, useState } from "react";
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
  root :{
    padding: 8,
    [theme.breakpoints.down("xs")]:{
      padding: 0
    }
  },
  shippingCardBox: {
    minHeight: 150,
    border: "1px solid #cdcbcb",
    margin: 8,
    borderRadius: 9,
    display: "flex",
    padding: "18px 28px",
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
    padding: "18px 28px",
    position: "relative",
    "& #cardActive": {
      display: "flex!important",
    },
    [theme.breakpoints.down("xs")]: {
      margin: "8px 0px",
    },
  },
  cardActive: {
    top: "-8px",
    right: "-8px",
    border: "1px solid #00000000",
    display: "none",
    position: "absolute",
    borderRadius: "25px",
    backgroundColor: "#1E3A3A ",
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
    height: "150px",
    margin: 8,
    backgroundColor: "#bcbcbc",
    borderRadius: 9,
    display: "flex",
    padding: "18px 28px",
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
    marginTop: 52,
    marginLeft: 8,
    [theme.breakpoints.down("xs")]: {
      margin: "16px 0",
      justifyContent: "space-between",
    },
  },
  cancelButton: {
    minWidth: 260,
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
      width: "100%",
      minWidth: "auto"
    },
  },
  saveButton: {
    minWidth: 260,
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
      width: "100%",
      minWidth: "auto"
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
  subTitle2: {
    fontSize: "20px",
    fontWeight: "bold",
    marginLeft: "8px",
    marginTop: "24px",
    marginBottom: "30px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "16px",
      marginLeft: "0px",
      marginBottom: 8
    },
  },
}));

const EditAddressChoice = (props) => {
  const {
    setOpenCreateAddress,
    addressList,
    setAddressList,
    setReload,
    setEditSelection,
    setIsSelectAddress,
  } = props;
  const classes = useStyles();
  const addressSelected = JSON.parse(sessionStorage.getItem("addressSelected")); //eslint-disable-line
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
                  &nbsp;
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
                    title: "EDIT ADDRESS",
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
    <Box className={classes.root}>
      <Typography className={classes.subTitle2}>EDIT ADDRESS</Typography>
      <Grid container>
        {showContent()}
        <Grid item xs={12} sm={6}>
          <Box className={classes.addnewbuttonBox}>
            <Button
              onClick={() => {
                sessionStorage.setItem(
                  "editAddress",
                  JSON.stringify({
                    title: undefined,
                  })
                );
                setOpenCreateAddress(true);
              }}
              className={classes.addButton}
            >
              <AddIcon />
              &nbsp;Add new address
            </Button>
          </Box>
        </Grid>
      </Grid>
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
                "addressSelected",
                JSON.stringify(selected || addressSelected)
              );
              setEditSelection(false);
              setIsSelectAddress(true);
              if(selected?.id === addressSelected?.id){
               setReload((prev) => !prev);
              }
            }}
            className={classes.saveButton}
          >
            Confirm
          </Button>
        </Box>
      </Hidden>
      <Hidden smUp={true}>
        <StickyActionBox zIndex={3}>
          <Grid container>
            <Grid item xs={6}>
              <Box pr={1}>
                <Button
                  className={classes.cancelButton}
                  onClick={() => setEditSelection(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box pl={1}>
                <Button
                  onClick={() => {
                    sessionStorage.setItem(
                      "addressSelected",
                      JSON.stringify(selected || addressSelected)
                    );
                    setEditSelection(false);
                    setIsSelectAddress(true);
                    if(selected?.id === addressSelected?.id){
                      setReload((prev) => !prev);
                    }
                  }}
                  className={classes.saveButton}
                >
                  Confirm
                </Button>
              </Box>
            </Grid>
          </Grid>
        </StickyActionBox>
      </Hidden>
    </Box>
  );
};

export default EditAddressChoice;
