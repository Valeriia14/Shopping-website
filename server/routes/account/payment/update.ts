import { controller, Request, Response } from "@kidztime/middlewares";
import { Account } from "@kidztime/models";
import { Transaction } from "sequelize/types";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default controller(async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const { objectmeta_id } = req.params;
  const opts: GenericOpts = {};
  const { transaction } = opts;

  if (self) {
    await Account.update(
      {
        payment_method_default_id: objectmeta_id,
      },
      {
        where: {
          id: self?.id,
        },
        transaction,
      }
    );
  }

  res.result = {};
});
