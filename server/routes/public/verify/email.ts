import { BadRequestError } from "@kidztime/errors";
import { controller, Request, Response } from "@kidztime/middlewares";
import { SvIdentitiy } from "@kidztime/services";
import config from "@kidztime/config";

export default controller(async (req: Request, res: Response) => {
  const { token } = req.query;
  if (!token)
    throw new BadRequestError("invalid token");

  const em_token = token.toString();
  await SvIdentitiy.verify_email({
    ip_address: req.attr?.ip,
    token: em_token,
  });

  res.result.path = config.paths.login_url;
});