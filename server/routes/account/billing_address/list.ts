import { controller, Request, Response } from "@kidztime/middlewares";
import { Account, BillingAddress } from "@kidztime/models";
import e from "cors";
import { Transaction } from "sequelize/types";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default controller(async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const opts: GenericOpts = {};
  const { transaction } = opts;

  const model = await BillingAddress.findAll({
    where: {
      account_id: self.id,
    },
    transaction,
  });

  let addresses;
  if (model) {
    addresses = model.map((item) => {
      let address = item?.dataValues
      if (self?.billing_default_id === item?.id) {
        address = {
          ...address,
          billing_default: true,
        };
      } 
      return address
    });
  }

  res.result.model = addresses;
});
