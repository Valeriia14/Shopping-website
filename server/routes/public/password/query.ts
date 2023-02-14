import { controller, Request, Response } from "@kidztime/middlewares";
import { SvAuthenticate } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { token } = req.query;
  if (!token) return;

  const account = await SvAuthenticate.query_password_reset(<string>token);

  const result: any = {};
  result.email = account.email_address;
  result.firstname = account.firstname;
  result.lastname = account.lastname;

  res.result = result;
});