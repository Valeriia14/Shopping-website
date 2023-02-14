import { controller, Request, Response } from "@kidztime/middlewares";
import { CartItem } from "@kidztime/models";
import { Transaction } from "sequelize/types";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default controller(async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const opts: GenericOpts = {};
  const { transaction } = opts;
  const { product_id } = req.params;
  const { session_id } = req.body;
  let cart_item;
  if (self) {
    cart_item = await CartItem.create(
      {
        product_id,
        product_type: "product",
        session_id: self.session.slice(-1)[0].dataValues.id,
      },
      { transaction }
    );
  } else {
    cart_item = await CartItem.create(
      {
        product_id,
        product_type: "product",
        session_id: session_id,
      },
      { transaction }
    );
  }
  res.result = cart_item;
});
//authorization
