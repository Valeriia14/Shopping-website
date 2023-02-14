import { colors } from "@material-ui/core";

const white = "#fff";
const black = "#000";
const grey = "#f4f4f4";
const purple = "#2e2965";
const darkPurple = "#2d2866";
const disabledPurple = "#2d286630";
const pink = "#e93d5e";
const darkTeal = "#1E3A3A";

export default {
  primary: {
    contrastText: "#fff",
    main: darkTeal,
    dark: darkPurple,
    disabled: disabledPurple
  },
  secondary: {
    contrastText: "#fff",
    main: pink,
    light: "#df4f6b",
    white,
    grey,
    black
  },
  error: {
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400]
  },
  success: {
    dark: colors.green[900],
    main: colors.green[600],
    light: colors.green[400]
  },
  text: {
    default: black,
    primary: black,
    secondary: darkTeal,
    light: white,
    link: colors.blue[600]
  },
  link: colors.blue[800],
  icon: colors.blueGrey[600],
  divider: "#BDBDBD",
  boxBorder: "#979797"
};
