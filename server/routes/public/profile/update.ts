import { AuthError } from './../../../../core/errors/errors';
import { controller, Request, Response } from "@kidztime/middlewares";
import { Account } from "@kidztime/models";
import { model_utils } from "@kidztime/utilities";
import { BadRequestError } from "@kidztime/errors";
import { update_user_profile } from "@kidztime/services/account/profile";

export default controller(async (req: Request, res: Response) => {
  const { crudscope, self } = req.extras!;
  if(!self){
    throw new AuthError("account");
  }
  const profile = req.body;
  try{
    const updated_account = await update_user_profile(self.id, profile, { ip_address: req.attr?.ip })
    res.result = updated_account;
  }catch(e){
      console.log(e)
    throw new BadRequestError(`invalid request body`)
  }
});
