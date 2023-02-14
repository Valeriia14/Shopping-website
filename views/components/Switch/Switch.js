import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Switch as MaterialUISwitch} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 45,
    height: 22,
    padding: 0,
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(23px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#1E3A3A',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#1E3A3A',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 20,
    height: 20,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}));

const Switch = props => {
  const classes = useStyles();
  return (
    <MaterialUISwitch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
};

export default Switch;
