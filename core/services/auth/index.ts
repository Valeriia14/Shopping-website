import * as auth from "./auth";
import * as privilege from "./privilege";
import * as password from "./password";

export default {
  ...auth,
  ...privilege,
  ...password,
};