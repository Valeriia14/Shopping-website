import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { BaseButton } from "@ktwebsite/components";


const useStyles = makeStyles((theme) => ({
  loadMoreBtn: {
    background: "#f8d03f",
    borderRadius: "15px",
    height: "35px"
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: 700
  },
  buttonWingLeft: {
    width: "60px",
  },
  buttonWingRight: {
    width: "60px",
    transform: "rotate(180deg)"
  }
}));

const LoadMore = props => {

  const classes = useStyles({});

  return (
    <Box mt={5} width="100%" display="flex" flexDirection="row" alignContent="center" justifyContent="center">
      <Box mr={2} mt={1.2}>
        <img src="/images/button-wings.svg" className={classes.buttonWingLeft} />
      </Box>
      <BaseButton buttonClassName={classes.loadMoreBtn}
        text="Load More" textClassName={classes.loadMoreText} />
      <Box ml={2} mt={1.2}>
        <img src="/images/button-wings.svg" className={classes.buttonWingRight} />
      </Box>
    </Box>
  );
};

export default LoadMore;
