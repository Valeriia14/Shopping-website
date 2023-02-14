import { Box, makeStyles, Slide } from "@material-ui/core";
import React, { Fragment } from "react";
import valid from "card-validator";

export const useStyles = makeStyles((theme) => ({
  methodImg: {
    width: "100%",
    height: "100%",
  },
}));

const ValidateCardCredit = (props) => {
  const { value, brand } = props;
  const cardIcon = {
    "american-express": "/images/AMEX_img.svg",
    visa: "/images/VISA_img.svg",
    mastercard: "/images/MASTER_img.svg",
  };
  const classes = useStyles();
  return (
    <Fragment>
      {value && (
        <Box width="100%" height="100%" mt="5px">
          {valid.number(value)?.card?.type ? (
            cardIcon[valid.number(value)?.card?.type] ? (
              <Slide direction="left" in={true}>
                <img
                  src={cardIcon[valid.number(value)?.card?.type]}
                  className={classes.methodImg}
                  alt={valid.number(value)?.card?.type || ""}
                />
              </Slide>
            ) : (
              <Slide direction="left" in={true}>
                <img
                  src="/images/Undefined_card_img.svg"
                  className={classes.methodImg}
                  alt={"invalid_img"}
                />
              </Slide>
            )
          ) : (
            <Slide direction="left" in={true}>
              <img
                src="/images/Undefined_card_img.svg"
                className={classes.methodImg}
                alt={"invalid_img"}
              />
            </Slide>
          )}
        </Box>
      )}
      {brand && (
        <Box width="100%" height="100%" mt="5px">
          {cardIcon[brand?.toLowerCase()] ? (
            <Slide direction="right" in={true}>
              <img
                src={cardIcon[brand?.toLowerCase()]}
                className={classes.methodImg}
                alt={brand?.toLowerCase() || ""}
              />
            </Slide>
          ) : (
            <Slide direction="right" in={true}>
              <img
                src="/images/Undefined_card_img.svg"
                className={classes.methodImg}
                alt={"invalid_img"}
              />
            </Slide>
          )}
        </Box>
      )}
    </Fragment>
  );
};
export default ValidateCardCredit;
