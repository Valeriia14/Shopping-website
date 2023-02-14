import config from "@kidztime/config";
import { BadRequestError } from "@kidztime/errors";
import { Credential, PasswordRequest, transact, Account } from "@kidztime/models";
import moment from "moment";
import { gen_token } from "@kidztime/utilities";
import { SvMail, SvIdentitiy, SvLog } from "@kidztime/services";
import { LogMessage } from "@kidztime/constants";

export type RequestOpts = {
  ip_address?: string;
  actor_id?: number | null;
};

/**
 * Verifies if token used for password reset request is valid
 * 
 * @param token - string used to retrieve password request
 * 
 * @throws BadRequestError:token not found - if token is undefined
 * @throws BadRequestError:invalid token - if token is not a password request token
 * @throws BadRequestError:token has been used - if token has already been used
 * @throws BadRequestError:token expired - if token has timedout
 * 
 * @returns the password request of the valid token 
 */
const query_for_token = async (token: string): Promise<PasswordRequest> => {
  if (!token)
    throw new BadRequestError("token not found");
  const pw_request = await PasswordRequest.findOne({
    where: {
      type: PasswordRequest.Types.TokenLink,
      code: token,
    },
  });
  if (!pw_request)
    throw new BadRequestError("invalid token");
  if (pw_request.reset_at)
    throw new BadRequestError("already reset");
  if (pw_request.expired_at && moment().isAfter(pw_request.expired_at))
    throw new BadRequestError("request expired");
  return pw_request;
};

export type PWRequestSource = "cms" | "ecomm-web";
export type PasswordRequestOpts = {
  client_id: string;
  source: PWRequestSource;
};
const pw_reset_url_for_source = (source: PWRequestSource) => {
  switch (source) {
    case "cms": return config.paths.pw_reset_cms_url;
    default: return config.paths.pw_reset_url;
  }
};
/**
 * Uses client_id to request for password reset,
 * Creates the request with a token,
 * Finds the person, thier email,
 * Sends the mail 
 * 
 * @param client_id - Login ID provided by authenticator
 * @param opts - {@link RequestOpts} Has option for requestor's ip address
 * 
 * @returns the created password request model
 */
export const request_password_reset = async (props: PasswordRequestOpts, opts: RequestOpts = {}) => {
  const type = Credential.Types.password;
  const access_handle = props.client_id;
  const credential = await Credential.findOne({
    where: { access_handle, type },
    include: [Account],
  });

  // fail silently
  if (credential?.type !== Credential.Types.password) return;

  const ttl: number = config.auth.pw_request_expiry;
  const token = gen_token(128);
  const expiry = moment().add(ttl, "second");

  const model = await transact().run(async (transaction) => {

    const model = await PasswordRequest.create({
      credential_id: credential.id,
      type: PasswordRequest.Types.TokenLink,
      ip_request: opts.ip_address,
      expired_at: expiry,
      code: token,
    }, { transaction });

    const account = await Account.findByPk(credential.account_id!, { transaction });
    if (account?.email_address) {
      const url = pw_reset_url_for_source(props.source).replace(":token", token);
      SvMail.send_password_request(account, url, expiry);
    }

    await SvLog.log_activity({
      category: PasswordRequest.name,
      description: LogMessage.PasswordRequest,
      owner: account!,
      actor_id: (opts.actor_id === null) ? credential.account_id! : opts.actor_id!,
      ip_address: opts.ip_address!,
    }, { transaction });

    return model;
  });

  return model;
};

/**
 * Retrieves credential account of password reset query
 * 
 * @param token - string used to retrieve password request
 * 
 * @returns the account of the valid credential
 */
export const query_password_reset = async (token: string): Promise<Account> => {
  const pw_request = await query_for_token(token);
  const credential = await Credential.findByPk(pw_request.credential_id!, {
    include: [Account],
  });

  return credential!.account!;
};

/**
 * Verifies token, 
 * Retrieves credential for valid password request,
 * Updates password request and credential with latest info,
 * Send password reset confirmation email 
 * 
 * @param token - string to retrieve password request
 * @param password_hash - Bcrypt hash of the password
 * @param opts - {@link RequestOpts} Has option for requestor's ip address
 */
export const update_password = async (token: string, password_hash: string, opts: RequestOpts = {}) => {
  const pw_request = await query_for_token(token);
  const credential = await Credential.findByPk(pw_request.credential_id!);

  const timestamp = moment();
  await transact().run(async (transaction) => {
    await pw_request.update({
      ip_reset: opts.ip_address,
      ip_last_attempt: opts.ip_address,
      reset_attempts: pw_request.reset_attempts! + 1,
      reset_at: timestamp,
    }, { transaction });

    await credential!.update({
      secret: password_hash,
      last_changed_at: timestamp,
    }, { transaction });

    const account = await Account.findByPk(credential!.account_id!, { transaction });
    await SvLog.log_activity({
      category: PasswordRequest.name,
      description: LogMessage.PasswordReset,
      owner: account!,
      actor_id: (opts.actor_id === null) ? account!.id : opts.actor_id!,
      ip_address: opts.ip_address!,
    }, { transaction });
  });

  const { ip_address = "Unknown" } = opts;
  const { account_id } = credential!;
  setTimeout(async () => {
    const ip_geolocation = await SvIdentitiy.ipgeolocation(ip_address!);
    const account = await Account.findByPk(account_id!);
    SvMail.send_password_reset_confirm(account!, ip_address, ip_geolocation, timestamp);
  });
};