import React, { useCallback } from "react";
import { Box, Button, Grid, makeStyles, Typography } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
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
    backgroundColor: "#1E3A3A",
    "& svg": {
      fill: "white",
    },
  },
  ediButton: {
    position: "absolute",
    padding: 4,
    minWidth: "fit-content",
    right: "12px",
    bottom: "12px",
    borderRadius: 25,
  },
  addAddressButtonBox: {
    height: "150px",
    margin: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "28px 18px",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
    },
  },
  addAddressButton: {
    margin: 8,
    height: "fit-content",
    borderBottom: "2px solid",
    padding: "0px",
    borderRadius: 0,
    textTransform: "none",
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: "24px",
    textAlign: "left",
  },
  addnewbuttonBox: {
    minHeight: 150,
    margin: 8,
    backgroundColor: "#bcbcbc",
    borderRadius: 5,
    display: "flex",
    padding: 16,
    [theme.breakpoints.down("xs")]: {
      margin: "8px 0px",
    },
  },
  addButton: {
    width: "100%",
    textTransform: "none",
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: "19px",
    textAlign: "left"
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

const ShippingList = (props) => {
  const { setOpenCreateAddress, addressList, setEditSelection } = props;
  const classes = useStyles();

  const setNameCustomer = useCallback((item) => {
    let firstName = item?.firstname ? item?.firstname : "-";
    let lastName = item?.lastname ? item?.lastname : "";
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    return firstName + " " + lastName;
  }, []); // eslint-disable-line

  const showContent = () => {
    return addressList?.map((item, index) => {
      const addressSelected = JSON.parse(
        sessionStorage.getItem("addressSelected")
      );
      return (
        <Grid key={index} item xs={12} sm={6}>
          <Box
            className={
              item?.id === addressSelected?.id
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
    <Grid container>
      {showContent()}
      {addressList?.length <= 0 && (
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
      )}
      {addressList?.length > 0 && (
        <Grid item xs={12} sm={6}>
          <Box className={classes.addAddressButtonBox}>
            <Button
              className={classes.addAddressButton}
              onClick={() => setEditSelection(true)}
            >
              + Change/Add new address
            </Button>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default ShippingList;
