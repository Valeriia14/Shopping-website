import { controller, Request, Response } from "@kidztime/middlewares";
import { Account, Address } from "@kidztime/models";
import { Transaction } from "sequelize/types";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default controller(async (req: Request, res: Response) => {
  const { self, address } = req.extras!;
  const opts: GenericOpts = {};
  const { transaction } = opts;
  const { address_id } = req.params;

  await Address.destroy({
    where: {
      id: address_id,
    },
    transaction,
  });

  if (self?.shipping_default_id === address?.id) {
    await Account.update(
      {
        shipping_default_id: null,
      },
      {
        where: {
          id: self?.id,
        },
        transaction,
      }
    );
  }  
  res.result.model = {};
});
