import { controller, Request, Response } from "@kidztime/middlewares";
import { SvCart } from "@kidztime/services";
import { Transaction } from "sequelize/types";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default controller(async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const { session_ids } = req.params;
  let cart;
  if (!self) {
    cart = await SvCart.cart_detail({ arr_session: JSON.parse(session_ids) });
  } else {
    cart = await SvCart.cart_detail_account({ account_id: self.id });
  }
  res.result = cart;
});
//authorization
