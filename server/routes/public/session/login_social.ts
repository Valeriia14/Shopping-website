import { controller, Request, Response } from "@kidztime/middlewares";
import { Account, Order } from "@kidztime/models";
import { SvAuthenticate, SvOrder } from "@kidztime/services";
import { model_utils, validator } from "@kidztime/utilities";
import { SvIdentitiy } from "@kidztime/services";
import moment from "moment";

export default controller(async (req: Request, res: Response) => {

  const { type, data } = req.body;
  if (!type && !data || !type && data || type && !data) {
    res.result = {
      error: {
        type: "ValidationError",
        message: "Validation error: Validation notEmpty on secret failed"
      }
    }
  }
  let client_id = "";
  let password, firstname, lastname, email_address, phone_number, delivery_address, postal_code, google_id, facebook_id;
  password = firstname = lastname = email_address = phone_number = delivery_address = postal_code = google_id = facebook_id = "";

  if (type == "google") {
    client_id = data.googleId;
    email_address = data.email;
    firstname = data.familyName;
    lastname = data.givenName;
    google_id = data.googleId;
  }
  if (type == "facebook") {
    client_id = facebook_id = data.userID;
    if(data.name){
      const [first, last] = data.name.split(' ');
       firstname = first;
       lastname = last;
    }
  }
  let account = await SvAuthenticate.validate_credentials_social(type, client_id, email_address);
  if (!account) {
    // Create new account
    account = await SvIdentitiy.register({
      password, firstname, lastname,
      email_address, phone_number, delivery_address, postal_code,
      actor_id: null,
      skip_email: true,
      google_id,
      facebook_id
    }, { ip_address: req.attr?.ip });
  }
  let self = await model_utils.scope(Account, "account").findByPk(account!.id);

  if (req.cookies && req.cookies["order_id"]) {
    // Archive the previous cart
    await Order.destroy({
      where: {
        account_id: account!.id,
        status: Order.STATUS.open
      },
    });
    await SvOrder.update_order_owner({ account_id: self!.id, order_id: req.cookies["order_id"] })
    self = await model_utils.scope(Account, "account").findByPk(self!.id);
    res.clearCookie("order_id");
  }

  if (self!.order === null) {
    self!.order = await SvOrder.create_order({ account_id: self!.id }, { ip_address: req.attr?.ip });
    self = await model_utils.scope(Account, "account").findByPk(account!.id);
  }
  const workspace_reference = account!.reference;

  const { token, expiry } = await SvAuthenticate.generate_jwt(account!, {
    ...workspace_reference && {
      claims: { aet: workspace_reference! },
    },
  });
  const expires_at = expiry.unix();
  const expires_in = expires_at - moment().unix();

  res.result = {
    self,
    access: { token, expires_at, expires_in },
  };
});
