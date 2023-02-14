import { controller, Request, Response } from "@kidztime/middlewares";
import { Credential } from "@kidztime/models";
import { SvAuthenticate } from "@kidztime/services";
import { validator } from "@kidztime/utilities";
import { Transaction } from "sequelize/types";
import bcrypt from "bcrypt";
import { ServerError } from "@kidztime/errors";
import moment from "moment";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default controller(
  [
    validator.required("current_password", { trim: true }),
    validator.required("new_password", { trim: true }),
    validator.password("new_password"),
  ],
  async (req: Request, res: Response) => {
    const account = req.extras!.account;
    const opts: GenericOpts = {};
    const { transaction } = opts;
    const timestamp = moment();

    const credential = await Credential.findOne({
      where: {
        account_id: account?.id,
      },
      transaction,
    });
    const { current_password, new_password } = req.body;

    const validate_password = bcrypt.compareSync(
      current_password,
      credential?.secret
    );

    if (!validate_password) {
      throw new ServerError("Password is incorrect !");
    } else {
      const credential_update = await credential!.update(
        {
          secret: new_password,
          last_changed_at: timestamp,
        },
        { transaction }
      );
      res.result = credential_update;
    }
  }
);
