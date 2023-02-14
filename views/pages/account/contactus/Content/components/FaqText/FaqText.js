import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  fqaHeader: {
    fontWeight: 600,
    marginBottom: "10px"
  }
}));

const FaqText = props => {
  const classes = useStyles({});
  const { title, body } = props;
  return (
    <Box mb={3}>
      <Typography variant="h4" className={classes.fqaHeader}>{title}</Typography>
      <Typography variant="body2">{body}</Typography>
    </Box>
  );
};

export default FaqText;