import { controller, Request, Response } from "@kidztime/middlewares";
import { Account } from "@kidztime/models";
import { SvAuthenticate } from "@kidztime/services";
import { model_utils, validator } from "@kidztime/utilities";

export default controller([
  validator.id_array(["privileges"]),
], async (req: Request, res: Response) => {
  const { crudscope, account, self } = req.extras!;
  const { privileges } = req.body;

  await SvAuthenticate.update_admin_privilege({
    privileges,
    recipient: account,
    actor_id: self.id,
  }, { ip_address: req.attr?.ip });

  res.result.model = await model_utils.scope(Account, crudscope).findByPk(account.id);
});