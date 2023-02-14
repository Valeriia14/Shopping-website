import { createTheme } from "@material-ui/core";

import overrides from "./overrides";
import typography from "./typography";
import palette from "./palette";

const theme = createTheme({
  overrides,
  typography,
  palette,
});

export default theme;
