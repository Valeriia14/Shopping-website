import { controller, Request, Response } from "@kidztime/middlewares";
import { Account, Address } from "@kidztime/models";
import { Transaction } from "sequelize/types";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default controller(async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const opts: GenericOpts = {};
  const { transaction } = opts;
  const {
    street_address,
    unit_no,
    country,
    city,
    postal_code,
    firstname,
    lastname,
    contact_number,
    account_id,
    type,
    office_department,
    set_shipping_default,
  } = req.body;

  const model = await Address.create({
    street_address,
    unit_no,
    country,
    city,
    postal_code,
    firstname,
    lastname,
    contact_number,
    account_id,
    type,
    office_department,
  });
  if (set_shipping_default) {
    await Account.update(
      {
        shipping_default_id: model?.id,
      },
      {
        where: {
          id: self?.id,
        },
        transaction,
      }
    );
  }
  res.result.model = model;
});
