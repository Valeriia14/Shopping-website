import config from "@kidztime/config";
import { BadRequestError } from "@kidztime/errors";
import { make } from "@kidztime/middlewares";
import { Account, ObjectMeta, ServiceProfile } from "@kidztime/models";
import { chirp } from "@kidztime/utilities";
import Stripe from "stripe";

export const stripe = new Stripe(config.stripe.secret_key, {
  apiVersion: config.stripe.api_version,
});

export const load_stripe_profile = ({ create = true } = {}) => {
  return make(async (req, res) => {
    const { self } = req.extras!;
    chirp("m: stripe.load_profile");

    let profile = await ServiceProfile.findOne({
      where: {
        account_id: self.id,
        service: ServiceProfile.SERVICE.stripe,
      },
    });

    if (!profile && create) {
      const customer = await stripe.customers.create({
        description: self.reference,
        email: self.email_address,
      });
      profile = await ServiceProfile.create({
        account_id: self.id,
        service: ServiceProfile.SERVICE.stripe,
        key: customer.id,
      });
    }
    req.extras!.stripe_profile = profile;
  });
};

export const create_stripe_source = async (stripe_profile: ServiceProfile, stripe_token: string, set_default_payment: boolean, self: Account) => {
  let stripe_card: any = null;
  try {
    stripe_card = await stripe.customers.createSource(stripe_profile.key!, { source: stripe_token });
  } catch (e) {
    throw new BadRequestError("cannot retrieve card!", e);
  }

  const model = await ObjectMeta.create({
    value: stripe_card.id,
    extra0: stripe_card.brand,
    extra1: stripe_card.last4,
    extra2: stripe_card.exp_month,
    extra3: stripe_card.exp_year,
    owner_type: ServiceProfile.name,
    owner_id: stripe_profile.id,
    key: "stripe_source",
  });
  if(set_default_payment){
    await Account.update(
      {
        payment_method_default_id: model?.id,
      },
      {
        where: {
          id: self?.id,
        },
      }
    );
  }
  return model;
};

export const create_charges = async (amount: number, stripe_token: string, currency: 'SGD') => {
  try {
   return await stripe.charges.create({
      amount,
      source: stripe_token,
      currency
    }).then(() => {
      return { message: "Payment succeeded!" }
    }).catch((e) => {
      console.log('Charge Fail', e)
      throw new BadRequestError("Your payment was not successful, please try again.")
    })
  } catch (e) {
    throw new BadRequestError(e.message)
  }
};