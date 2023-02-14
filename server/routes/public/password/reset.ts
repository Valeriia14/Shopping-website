import { controller, Request, Response } from "@kidztime/middlewares";
import { SvAuthenticate } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.required("token", { trim: true }),
  validator.password("password"),
], async (req: Request, res: Response) => {
  const { token, password } = req.body;

  await SvAuthenticate.update_password(token, password, {
    ip_address: req.attr?.ip,
    actor_id: null,
  });
});