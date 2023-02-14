import { PrivilegeNames } from "@kidztime/constants";
import { BadRequestError } from "@kidztime/errors";
import { controller, Request, Response } from "@kidztime/middlewares";
import { Credential, Account, transact } from "@kidztime/models";
import { SvAuthenticate, SvIdentitiy } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.object("user"),
  validator.password("user.password"),

  validator.required("user.firstname"),
  validator.trim(["user.lastname", "user.phone_number"]),
  validator.trim(["user.email_address"], { lowercase: true }),
], async (req: Request, res: Response) => {
  const { user } = req.body;

  const existing_account = await Account.findOne();
  if (existing_account)
    throw new BadRequestError("already init");

  const {
    password,
    firstname, lastname,
    email_address, phone_number,
  } = user;
  const ip_address = req.attr?.ip;

  const account = await transact().run<Account>(async (transaction) => {
    const account = await SvIdentitiy.create_account({
      firstname, lastname, email_address,
      phone_number,
      actor_id: null,
    }, { transaction, ip_address });

    await SvAuthenticate.add_privilege({
      privileges: [PrivilegeNames.KidztimeSuperAdmin],
      recipient: account,
      actor_id: account.id,
    }, { transaction, ip_address });

    await SvIdentitiy.create_credential({
      account: account,
      access_handle: email_address,
      secret: password,
      type: Credential.Types.password,
      actor_id: account.id,
    }, { transaction, ip_address });
    return account;
  });

  res.result = { account };
});
