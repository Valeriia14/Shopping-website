import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useMemo } from "react";

const ErrorMessage = (props) => {
  const { className, error, ...rest } = props;
  const classes = useStyles();

  const message = useMemo(() => error?.message ?? error?.toString(), [error]);

  if (!message) return null;

  return (
    <Box {...rest} className={clsx(classes.root, className)}>
      <Typography variant="body1" color="error">{message}</Typography>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default ErrorMessage;
