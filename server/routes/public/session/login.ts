import { controller, Request, Response } from "@kidztime/middlewares";
import { Account, Order } from "@kidztime/models";
import { SvAuthenticate, SvOrder } from "@kidztime/services";
import { model_utils, validator } from "@kidztime/utilities";
import moment from "moment";

export default controller([
  validator.required("password", { trim: true }),
  validator.required(["username"], { lowercase: true, trim: true }),
], async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const account = await SvAuthenticate.validate_credentials(username, password);
  let self = await model_utils.scope(Account, "account").findByPk(account!.id);
  
  // if (req.cookies && req.cookies["order_id"]) {
  //   // Archive the previous cart
  //   await Order.destroy({
  //     where: {
  //       account_id: account!.id,
  //       status: Order.STATUS.open
  //     },
  //   });
  //   await SvOrder.update_order_owner({ account_id: self!.id, order_id: req.cookies["order_id"] })
  //   self = await model_utils.scope(Account, "account").findByPk(self!.id);
  //   res.clearCookie("order_id");
  // }

  // if (self!.order === null) {
  //   self!.order = await SvOrder.create_order({ account_id: self!.id }, { ip_address: req.attr?.ip });
  //   self = await model_utils.scope(Account, "account").findByPk(account!.id);
  // }
  const workspace_reference = account!.reference;

  const { token, expiry } = await SvAuthenticate.generate_jwt(account!, {
    ...workspace_reference && {
      claims: { aet: workspace_reference! },
    },
  });
  const expires_at = expiry.unix();
  const expires_in = expires_at - moment().unix();

  res.result = {
    self,
    access: { token, expires_at, expires_in },
  };
});
