import { controller, Request, Response } from "@kidztime/middlewares";
import { CartItem } from "@kidztime/models";
import { Transaction } from "sequelize/types";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default controller(async (req: Request, res: Response) => {
  const opts: GenericOpts = {};
  const { transaction } = opts;

  const { cart_item_id } = req.params;

  if (cart_item_id) {
    Promise.all([
      await CartItem.update(
        {
          status: CartItem.STATUS.deleted,
        },
        {
          where: {
            id: cart_item_id,
          },
          transaction,
        }
      ),
      await CartItem.destroy({
        where: {
          id: cart_item_id,
        },
        transaction,
      }),
    ]);
  }
  res.result = {};
});
//authorization
