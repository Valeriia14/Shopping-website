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
  const { user } = req.body;

  const {
    password, firstname, lastname,
    email_address, phone_number, delivery_address, postal_code
  } = user;

  await SvIdentitiy.register({
    password, firstname, lastname,
    email_address, phone_number, delivery_address, postal_code,
    actor_id: null,
  }, { ip_address: req.attr?.ip });
});