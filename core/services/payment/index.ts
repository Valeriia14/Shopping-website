import * as payment from "./payment";
import * as stripe from "./stripe";

export default {
  ...payment,
  ...stripe,
};