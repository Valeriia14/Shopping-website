import { controller, Request, Response } from "@kidztime/middlewares";
import { SvIdentitiy } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.object("user"),
  validator.password("user.password"),

  validator.required(["user.firstname", "user.phone_number"], { trim: true }),
  validator.required(["user.email_address"], { lowercase: true }),
  validator.trim(["user.lastname", "user.delivery_address", "user.postal_code"]),
], async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const { user } = req.body;

  const {
    password, firstname, lastname,
    email_address, phone_number, delivery_address, postal_code
  } = user;

  const created_account = await SvIdentitiy.register({ password, firstname, lastname, phone_number, email_address, delivery_address, postal_code, actor_id: self.id }, { ip_address: req.attr?.ip });

  res.result.model = created_account;
});
