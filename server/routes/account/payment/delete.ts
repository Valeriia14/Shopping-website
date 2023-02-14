import { controller, Request, Response } from "@kidztime/middlewares";
import { Account, ObjectMeta } from "@kidztime/models";
import { Transaction } from "sequelize/types";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default controller(async (req: Request, res: Response) => {
  const { self, objectmeta } = req.extras!;
  const { objectmeta_id } = req.params;
  const opts: GenericOpts = {};
  const { transaction } = opts;
 
  const model = await ObjectMeta.destroy({
    where: {
      id: objectmeta_id,
    },
    transaction,
  });
  let account;

  if (self?.payment_method_default_id === objectmeta?.id) {
    account = await Account.update(
      {
        payment_method_default_id: null,
      },
      {
        where: {
          id: self?.id,
        },
        transaction,
      }
    );
  }

  res.result = {
    model,
    account
  };
});
