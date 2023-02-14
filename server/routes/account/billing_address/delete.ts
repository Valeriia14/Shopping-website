import { controller, Request, Response } from "@kidztime/middlewares";
import { Account, BillingAddress } from "@kidztime/models";
import { Transaction } from "sequelize/types";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default controller(async (req: Request, res: Response) => {
  const { self, billing_address } = req.extras!;
  const opts: GenericOpts = {};
  const { transaction } = opts;
  const { billing_address_id } = req.params;

  await BillingAddress.destroy({
    where: {
      id: billing_address_id,
    },
    transaction,
  });

  
  if (self?.billing_default_id === billing_address?.id) {
    await Account.update(
      {
        billing_default_id: null,
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
