import { BadRequestError } from "@kidztime/errors";
import { controller, Request, Response } from "@kidztime/middlewares";
import { SvMail } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const {
    customer_email, first_name, last_name, phone, remarks
  } = req.body;
  await SvMail.send_contact_mail(customer_email, first_name, last_name, phone, remarks);
});
