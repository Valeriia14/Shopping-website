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

  await Address.update(
    {
      street_address,
      unit_no,
      country,
      postal_code,
      firstname,
      lastname,
      contact_number,
      account_id,
      type,
      city,
      office_department,
    },
    {
      where: {
        id: address_id,
      },
      transaction,
    }
  );
  if (set_shipping_default) {
    await Account.update(
      {
        shipping_default_id: address_id,
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
