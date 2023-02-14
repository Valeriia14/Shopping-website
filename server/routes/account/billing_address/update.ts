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
    set_billing_default,
  } = req.body;

  await BillingAddress.update(
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
        id: billing_address_id,
      },
      transaction,
    }
  );
  
  if (set_billing_default) {
    await Account.update(
      {
        billing_default_id: billing_address_id,
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
