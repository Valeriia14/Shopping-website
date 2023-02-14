import { controller, Request, Response } from "@kidztime/middlewares";
import { SvAuthenticate } from "@kidztime/services";
import { validator } from "@kidztime/utilities";
import { PWRequestSource } from "@kidztime/services/auth/password";

export default controller([
  validator.required(["username"], { trim: true }),
], async (req: Request, res: Response) => {
  const { username, cms } = req.body;

  const source: PWRequestSource = cms === "true" ? "cms" : "ecomm-web";
  // do not await, run away in the background
  SvAuthenticate.request_password_reset({
    client_id: username,
    source,
  }, {
    ip_address: req.attr?.ip,
    actor_id: null,
  });
});