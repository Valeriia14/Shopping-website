import config from "@kidztime/config";
import { chirp } from "@kidztime/utilities";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { Account, ObjectMeta } from "@kidztime/models";
import { Mailers } from "@kidztime/constants/mailers";
import { MailerProvider, MailerError, SendGrid } from "./providers";
import { Moment } from "moment";
import { Kidztime } from "@kidztime/constants";
import { ServerError } from "@kidztime/errors";

export type ResolveExchangeInvoiceProps = {
  data:{
    account: Account,
    url: string,
    order_date: string,
    order_ref: string,
    total_diff: string,
    receipt_diff: number,
    additional_shipping_fee: number,
    customer_name: string,
    customer_email: string,
    customer_phone_number: string,
    shipping_address: string,
    model: [{
      product_name: string,
      reference: string
      price: number,
      qty: number,
      status: string,
      sub_total : number
    }]
  }
};

const MailerProviders: { [index: string]: typeof MailerProvider } = {
  sendgrid: SendGrid.SendGridProvider,
};

let transporter: Mail | undefined;
let sender_mail: string | undefined;
type MailTemplateKey = keyof typeof Mailers.Keys;
type MailProviderKey = "sendgrid";
const mailer_providers: { [key: string]: MailerProvider } = {};
type Recipient = { 
  name?: string; 
  email: string ;
};

/**
 * Creates transporter using settings given in mailconfig
 *
 * @returns transporter Mail object
 */
const get_transporter = () => {
  if (!transporter) {
    const mailconfig = config.mailconfig;
    sender_mail = mailconfig.from;
    transporter = nodemailer.createTransport({
      host: mailconfig.host,
      port: mailconfig.port,
      secure: mailconfig.secure,
      auth: {
        user: mailconfig.user,
        pass: mailconfig.pass,
      },
    });
  }
  return transporter;
};

/**
 * Configures available mailers
 */
export const configure = async () => {
  const mailers = config.mailers || [];
  for (const mailer of mailers) {
    const provider_type: string = mailer.provider;
    const provider_constructor = MailerProviders[provider_type];
    const provider = new provider_constructor(mailer.config);
    mailer_providers[mailer.provider] = provider;
  }
  chirp(
    "mailer providers configured",
    Object.keys(mailer_providers).length,
    "templates"
  );
};

/**
 * Send an email with options
 *
 * @param options - {@link Mail.Options} Options to be set to email prior to sending
 */
export const send_mail = (options: Mail.Options) => {
  return new Promise((resolve, reject) => {
    const transporter = get_transporter();
    options.from = options.from || sender_mail;
    transporter.sendMail(options, (error, info) => {
      if (error) return reject(error);
      chirp(`message sent`, info.messageId);
      resolve(info);
    });
  });
};

/**
 * Sending an email with configured providers for specific templates
 *
 * @param template_key - {@link MailTemplateKey} Type of email to be sent
 * @param recipient - {@link Recipient} Has name and email of reciever
 * @param params - Additional parameters to be included in email
 *
 * @throws MailerError:provider not found for template - Specified template key has no provider
 */
const send_with_provider = async (
  provider_key: MailProviderKey,
  template_key: MailTemplateKey, //"resolve request"
  recipient: Recipient,
  params?: { [index: string]: any }
) => {
  await configure()
  const provider = mailer_providers[provider_key];
  if (!provider) {
    if (process.env.NODE_ENV === "production")
      throw new MailerError(`provider not found for template:${template_key}`);

    return await send_mail({
      to: recipient.email!,
      subject: "dev email override",
      text: JSON.stringify(params),
    });
  }

  await provider.send({
    key: template_key,
    recipients: [
      {
        email: recipient.email,
        name: recipient.name,
        params,
      },
    ],
  });
};

/**
 * Created person's verfication email
 *
 * @param person - Receipient's person object
 * @param url - Verification url
 */
export const send_email_verification = async (
  account: Account,
  url: string
) => {
  const template_key: MailTemplateKey = "email_verfication";
  const params: typeof Mailers.EmailVerificationSchema.params = {
    email: account.email_address!,
    subject: "Email Verification",
    verificationUrl: url,
    websiteUrl: config.paths.website_url,
  };

  const recipient: Recipient = {
    name: account.firstname || undefined,
    email: account.email_address!,
  };
  await send_with_provider("sendgrid", template_key, recipient, params);
};

/**
 * Once person is verified, this email to be sent
 *
 * @param person - Verified person
 */
export const send_signup = async (account: Account) => {
  const template_key: MailTemplateKey = "signup";
  const params: typeof Mailers.SignUpSchema.params = {
    email: account.email_address!,
    name: account.firstname!,
    subject: "Welcome to Kidztime",
    aboutUrl: config.paths.about_url,
    loginUrl: config.paths.login_url,
    contactUrl: config.paths.contact_url,
    websiteUrl: config.paths.website_url,
  };

  const recipient: Recipient = {
    name: account.firstname || undefined,
    email: account.email_address!,
  };
  await send_with_provider("sendgrid", template_key, recipient, params);
};

/**
 * Password reset email
 *
 * @param person - The Person requesting the password reset
 * @param url - Reset url
 * @param expire_at - Expiration timestamp
 */
export const send_password_request = async (
  account: Account,
  url: string,
  expire_at: Moment
) => {
  const duration = expire_at.fromNow();
  const template_key: MailTemplateKey = "password_request";
  const params: typeof Mailers.PasswordRequestSchema.params = {
    email: account.email_address!,
    name: account.firstname!,
    subject: "Password Reset",
    resetUrl: url,
    expiration: duration,
    websiteUrl: config.paths.website_url,
  };

  const recipient: Recipient = {
    name: account.firstname || undefined,
    email: account.email_address!,
  };
  await send_with_provider("sendgrid", template_key, recipient, params);
};

/**
 * Password reset confirmation email
 *
 * @param person - The Person who requested password reset
 * @param ip_address - IP address requested from
 * @param location - Location requested from
 * @param timestamp - Time of reset confirmation
 */
export const send_password_reset_confirm = async (
  account: Account,
  ip_address: string,
  location: string,
  timestamp: Moment
) => {
  const template_key: MailTemplateKey = "password_reset_confirm";
  const params: typeof Mailers.PasswordResetConfirmSchema.params = {
    email: account.email_address!,
    name: account.firstname!,
    subject: "Password Reset Complete",
    ip_address,
    location,
    time: timestamp.format(Kidztime.HumanDateFormat),
    contactUrl: config.paths.contact_url,
    websiteUrl: config.paths.website_url,
  };

  const recipient: Recipient = {
    name: account.firstname || undefined,
    email: account.email_address!,
  };
  await send_with_provider("sendgrid", template_key, recipient, params);
};

/**
 * Identity verification request email
 *
 * @param email - Email of receiever
 * @param name - Name of receiver
 * @param account - Name of team
 * @param url - Verification URL
 */
export const send_verification_request = async (
  email: string,
  name: string,
  account: string,
  url: string
) => {
  const template_key: MailTemplateKey = "verification_request";
  const params: typeof Mailers.VerificationRequestSchema.params = {
    subject_name: name,
    email,
    account,
    verificationUrl: url,
    subject: "Identity Verification Request",
    websiteUrl: config.paths.website_url,
  };

  const recipient: Recipient = { email, name };
  await send_with_provider("sendgrid", template_key, recipient, params);
};

/**
 * Exchange Resolve Request email
 *
 * @param email - Email of receiever
 * @param name - Name of receiver
 * @param account - Name of team
 * @param url - Payment URL
 * @param order_date - "order-date"
 * @param total_diff - total diff
 * @param receipt_diff - Old Subtotal amount
 * @param additional_shipping_fee - The amount to be charged
 * @param model        - product list
 */
export const send_exchange_resolve_request = async (
  props: ResolveExchangeInvoiceProps
) => {
  const template_key: MailTemplateKey = "resolve_exchange_request";
  const { 
    url, order_date, order_ref, 
    total_diff, account, receipt_diff, additional_shipping_fee,
    model, customer_email, 
    customer_name, shipping_address ,
    customer_phone_number
  } = props.data
  
  const params: typeof Mailers.ResolveExchangeRequestSchema.params = {
    email: customer_email,
    name: customer_name!,
    customer_email: customer_email,
    customer_name: customer_name,
    customer_phone_number: customer_phone_number,
    subject: "Payment Request to resolve exchange",
    order_ref: order_ref,
    url,
    order_date,
    total_diff: total_diff,
    receipt_diff: receipt_diff.toString(),
    additional_shipping_fee: additional_shipping_fee.toString(),
    shipping_address: shipping_address,
    model
  };

  const recipient: Recipient = { email: params.email, name: params.name };
  await send_with_provider("sendgrid", template_key, recipient, params);
};

/**
 * Send contact mail
 *
 * @param person - Receipient's person object
 * @param url - Verification url
 */
export const send_contact_mail = async (
  customer_email: string,
  first_name: string,
  last_name: string,
  phone: string,
  remarks: string,
) => {
  const template_key: MailTemplateKey = "contact";
  const params: typeof Mailers.ContactSchema.params = {
    subject: "Kidztime - Contact mail",
    customer_email,
    first_name,
    last_name,
    phone,
    remarks,
  };

  const metadata = await ObjectMeta.findOne({
    where: {
      key: ObjectMeta.KEY.settings,
      value: 'contactMail'
    },
  })


  if (metadata && metadata.extra0){
    const adminEmail = metadata.extra0;
    const recipient: Recipient = {
      name: 'Kidztime',
      email: adminEmail,
    };

    await send_with_provider("sendgrid", template_key, recipient, params);
  } else {
    throw new ServerError("Missing contact mail config.");
  }
};
