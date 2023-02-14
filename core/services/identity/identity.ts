import { Credential, Account, transact, VerifyRequest } from "@kidztime/models";
import { GenericOpts } from "@kidztime/services/types";
import { BadRequestError } from "@kidztime/errors";
import { LogMessage } from "@kidztime/constants";
import { gen_token } from "@kidztime/utilities";
import moment from "moment";
import config from "@kidztime/config";
import { SvMail, SvLog, SvOrder } from "@kidztime/services";

export type CreateCredentialProps = {
  account: Account;
  type: string;

  access_handle: string;
  secret: string;

  actor_id: number;
};

export type CreateAccountProps = {
  firstname: string;
  lastname: string;
  email_address: string;
  phone_number?: string;

  delivery_address?: string;
  postal_code?: string;

  actor_id: number | null;

  google_id?: string;
  facebook_id?: string;
};

export type RegisterProps = {
  password: string;

  firstname: string;
  lastname: string;
  email_address: string;
  phone_number: string;
  delivery_address?: string;
  postal_code?: string;

  skip_email?: boolean;
  actor_id: number | null;
  google_id?: string;
  facebook_id?: string;
};

export type VerifyEmailProps = {
  token: string;
  ip_address: string;
  admin?: Account;
  skip_email?: boolean;
};

/**
 * Verifies access_handle is unique.
 * 
 * @param access_handle - email of requestor
 * @param opts - {@link GenericOpts} Has `transaction` object that executes sync
 * 
 * @throws BadRequestError:access_handle conflict - email is already in use 
 */
export const check_access_handle = async (access_handle: string, opts: GenericOpts = {}): Promise<void> => {
  const { transaction } = opts;
  const conflicted_credentials = await Credential.count({ where: { access_handle }, transaction });

  if (conflicted_credentials > 0) throw new BadRequestError("access_handle conflict");
};

/**
 * Creates credential
 * 
 * @param props - {@link CreateCredentialProps} Has parameters used to create credential
 * @param opts - {@link GenericOpts} Has transaction object that executes sync
 * 
 * @returns created credential
 */
export const create_credential = async (props: CreateCredentialProps, opts: GenericOpts = {}): Promise<Credential> => {
  const { access_handle, account, actor_id } = props;
  const { ip_address } = opts;
  const credential = await transact(opts.transaction).run<Credential>(async (transaction) => {
    await check_access_handle(access_handle, opts);

    const credential = await Credential.create({
      ...props,
      account_id: account.id,
    }, { transaction });

    await SvLog.log_activity({
      category: Credential.name,
      description: LogMessage.CreateCredential,
      owner: account,
      actor_id,
      ip_address
    }, { transaction });

    return credential;
  });
  return credential!;
};

/**
 * Verifies email has not been used,
 * Creates Account
 * 
 * @param props - {@link CreatePersonProps} Has parameters used to create Account
 * @param opts - {@link GenericOpts} Has `transaction` object that executes sync
 * 
 * @throws BadRequestError:email already registered -  email is already in use
 * 
 * @returns created account
 */
export const create_account = async (props: CreateAccountProps, opts: GenericOpts = {}): Promise<Account> => {
  const { email_address, actor_id } = props;
  const { ip_address } = opts;

  const account = await transact(opts.transaction).run<Account>(async (transaction) => {
    const person_conflict = await Account.findOne({
      where: {
        email_address,
      },
      transaction,
    });
    if (person_conflict)
      throw new BadRequestError("email already registered");

    const account = await Account.create({
      ...props,
    }, { transaction });

    await SvLog.log_activity({
      category: Account.name,
      description: LogMessage.CreateAccount,
      owner: account,
      actor_id: (props.actor_id === null) ? account.id : props.actor_id,
      account_id: account.id,
      ip_address
    }, { transaction });

    return account;
  });
  return account!;
};

/**
 * Verifies `invite_token` or `account_name` exists,
 * If `invite_token` exists, join account with token & precreated person,
 * Else create account & give owner privileges,
 * Creates credential,
 * Sends verification email if applicable,
 * 
 * @param props - {@link RegisterProps} Has parameters used to register 
 * @param opts - {@link GenericOpts} Has `transaction` object that executes sync
 * 
 * @throws BadRequestError:account name required - `invite_token` and `account_name` is undefined
 * 
 * @returns created person.account
 */
export const register = async (props: RegisterProps, opts: GenericOpts = {}): Promise<Account> => {
  const {
    password,
    firstname, lastname, email_address, phone_number, delivery_address, postal_code,
    skip_email,google_id,facebook_id
  } = props;
  let { actor_id } = props;
  const { ip_address } = opts;

  const account = await transact(opts.transaction).run(async (transaction) => {
    await check_access_handle(email_address, { transaction });

    const account = await create_account({ firstname, lastname, email_address, phone_number, delivery_address, postal_code, actor_id, google_id, facebook_id }, { transaction });
    actor_id = (props.actor_id === null) ? account.id : props.actor_id;
    if(password){
      await create_credential({
        access_handle: email_address,
        secret: password,
        type: Credential.Types.password,
        account: account,
        actor_id,
      }, { transaction });
    }

    await SvOrder.create_order({
      account_id: account.id,
    }, { transaction });

    await SvLog.log_activity({
      category: Account.name,
      description: LogMessage.Register,
      owner: account,
      actor_id,
      account_id: account.id,
      ip_address,
    }, { transaction });

    const email_verify_token = gen_token(128);
    const timestamp = moment();
    const ttl: number = config.auth.pw_request_expiry;
    const expiry = moment().add(ttl, "second");
    const verify_request = await VerifyRequest.create({
      account_id: account.id,
      type: VerifyRequest.Type.Email,
      token: email_verify_token,
      status: VerifyRequest.Status.Processing,
      open_at: timestamp,
      submit_at: timestamp,
      value: account.email_address,
      expire_at: expiry,
    }, { transaction });

    if (skip_email !== true && verify_request) {
      const verify_url = config.paths.verify_email_url.replace(":token", verify_request.token);
      SvMail.send_email_verification(account, verify_url);
    }

    return account;
  });
  return account;
};

/**
 * Verifies request using `token`,
 * Updates VerifyRequest and Person accordingly,
 * Sends "verified" email to person based on `skip_email` parameter
 * 
 * @param props - {@link VerifyEmailProps} Has parameters to verify
 * @param opts - {@link GenericOpts} Has `transaction` object that executes sync
 * 
 * @throws BadRequestError:invalid token - token has no request
 * @throws BadRequestError:invalid request status - request is still processing
 */
export const verify_email = async (props: VerifyEmailProps, opts: GenericOpts = {}) => {
  const { token, skip_email, ip_address } = props;

  const verify_request = await VerifyRequest.findOne({
    include: [Account],
    where: {
      type: VerifyRequest.Type.Email,
      token,
    },
    transaction: opts.transaction,
  });

  if (!verify_request)
    throw new BadRequestError("invalid token");
  if (verify_request.status === VerifyRequest.Status.Completed)
    return;
  if (verify_request.status !== VerifyRequest.Status.Processing)
    throw new BadRequestError("invalid request status");
  if (moment(verify_request!.expire_at!) > moment())
    throw new BadRequestError("expired token");

  const account = await transact(opts.transaction).run(async (transaction) => {

    const { account } = verify_request;
    const timestamp = moment();
    await verify_request.update({
      status: VerifyRequest.Status.Completed,
      result: VerifyRequest.Result.Verified,
      resolve_at: timestamp,
    }, { transaction });

    await account!.update({
      email_verified_at: timestamp,
    }, { transaction });

    await SvLog.log_activity({
      category: VerifyRequest.name,
      description: LogMessage.VerifyEmail,
      owner: account!,
      actor_id: account!.id,
      ip_address,
    }, { transaction });

    return account;
  });

  if (skip_email !== true)
    SvMail.send_signup(account!);
};
