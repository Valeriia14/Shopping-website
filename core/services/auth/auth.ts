import {  Request as ExpressRequest } from "express";
import config from "@kidztime/config";
import { AuthError, BadRequestError, ServerError } from "@kidztime/errors";
import { make } from "@kidztime/middlewares";
import { Credential, Account } from "@kidztime/models";
import { model_utils } from "@kidztime/utilities";
import bcrypt from "bcrypt";
import jwt, { SignOptions, verify, VerifyOptions } from "jsonwebtoken";
import moment from "moment";
import { SvOrder } from "..";
import { Op } from "sequelize";
export type JwtClaims = {
  iss?: string,
  exp: number,
  sub: string,
  iat?: number,
  scp?: string,
  aet?: string,
};

export enum AuthScope {
  Profile = "profile",
  Self = "self",
};

export type TokenOpts = {
  token_type?: JwtType;
  claims?: { [index: string]: string },
  scopes?: AuthScope[];
};

export enum JwtType {
  AccessToken = "access_token",
  RefreshToken = "refresh_token",
};

export type GenerateTokenResult = {
  token: string;
  expiry: moment.Moment;
};

export type AuthWorkspaceOptions = {
  optional?: boolean;
};

/**
 * Constant keys for token expiry property
 */
const TokenExpiryConfigKey = {
  [JwtType.AccessToken]: "access_expiry",
  [JwtType.RefreshToken]: "refresh_expiry",
};

/**
 * Returns the time-to-live in seconds given the token type. 
 * 
 * @param type - Type of token to retrieve expiry for. Defaults to `access_token`.
 * @param default_expiry - A default expiry if `type` is not registered. Global 
 * default of 3600 will be used if not defined.
 * 
 * @returns time-to-live (in seconds) for token based on token type, or `default_expiry` if 
 * `type` not registered
 */
const get_token_expiry = (type: JwtType = JwtType.AccessToken, default_expiry: number = 3600) => {
  const config_key = TokenExpiryConfigKey[type];
  return config.auth[config_key] || default_expiry;
};

/**
 * Check if password is valid
 * 
 * @param password_hash - Bcrypt hash of the password
 * @param password - Plaintext password provided by authenticator
 * 
 * @throws BadRequestError:invalid credentials - password does not match.
 */
export const validate_password = async (password_hash: string, password: string) => {
  const valid = await bcrypt.compare(password, password_hash);
  if (!valid)
    throw new BadRequestError("invalid credentials");
};

/**
 * Validates credentials & Returns account object
 * 
 * @param client_id - Login ID provided by authenticator
 * @param client_secret - Password provided by authenticator
 * 
 * @throws BadRequestError:invalid credentials - if credential is not valid.
 * 
 * @returns the account owning the authenticated credential.
 */
export const validate_credentials = async (client_id: string, client_secret: string) => {
  const type = Credential.Types.password;
  const access_handle = client_id;
  let credential: any = await Credential.findOne({ where: { access_handle, type } });
  if (!credential)
    throw new BadRequestError("invalid credentials");

  await validate_password(credential.secret, client_secret);

  const account = await Account.findByPk(credential.account_id);
  const timestamp = moment();
  await account!.update({ last_logged_in: timestamp });

  return account;
};

/**
 * Generates JWT for use to authenticate requests. 
 * 
 * @param account - Owner that is generating jwt
 * @param opts - {@link TokenOpts} options for generating JWT
 * 
 * @returns the token string and the expiry.
 */
export const generate_jwt = async (account: Account, opts: TokenOpts = {}): Promise<{ token: string, expiry: moment.Moment }> => {
  const { token_type = JwtType.AccessToken } = opts;
  const AUTH_PRV_KEY = config.auth.prv_key;

  const issuer = config.auth.token_issuer;
  const issue_at = moment();
  const expires_in = get_token_expiry(token_type);
  const expiry = moment(issue_at).add(expires_in, "second");

  const payload: JwtClaims = {
    iss: issuer,
    exp: expiry.unix(),
    sub: account.reference!,
    iat: issue_at.unix(),
    ...opts.claims && opts.claims,
  };
  const secret = AUTH_PRV_KEY;
  const options: SignOptions = { algorithm: "HS512" };
  const token = jwt.sign(payload, secret, options);

  return {
    token, expiry,
  };
};

/**
 * Verify authenticity of a JWT
 * 
 * @param token - the JWT string
 */
export const authenticate_claims = (token: string): JwtClaims => {
  const options: VerifyOptions = { algorithms: ["HS512"] };
  const AUTH_PRV_KEY: string = config.auth.prv_key;

  let claims: JwtClaims;
  try {
    claims = <JwtClaims>verify(token, AUTH_PRV_KEY, options);
  } catch (err) {
    console.error(err);
    if (err.message === "jwt expired")
      throw new AuthError("token expired");
    throw new AuthError("token");
  }
  return claims;
};

/**
 * Updates `last_seen_at` property of the authenticated account
 * 
 * @requires `req.extras.self` to be loaded (use authenticate middleware).
 * @memberof Middleware
 */
export const update_last_seen = () => {
  return make(async (req, res) => {
    const account = req.extras?.self;

    if (!account)
      throw new ServerError("self not loaded");

    const timestamp = moment();
    await account.update({ last_seen_at: timestamp });
  });
};

/**
 * Updates `last_order_at` property of the authenticated account
 * 
 * @requires `req.extras.self` to be loaded (use authenticate middleware).
 * @memberof Middleware
 */
export const update_last_order_at = () => {
  return make(async (req, res) => {
    const account = req.extras?.self;

    if (!account)
      throw new ServerError("self not loaded");

    const timestamp = moment();
    await account.update({ last_order_at: timestamp });
  });
};
export const get_token = (req: ExpressRequest): string => {
  let token = req.query.access_token as string;

  if (!token && req.headers.authorization) {
    const token_header = req.headers.authorization;
    if (!token_header?.match(/^Bearer [A-Za-z0-9\-\._~\+\/]+$/))
      throw new AuthError("token");
    token = token_header.substr("Bearer ".length);
  }

  if (!token) token = req.cookies?.["authorization"];

  if (token === "undefined") token = "";

  return token
}

export const parse_token = async (token: string) => {
  const claims: JwtClaims = authenticate_claims(token);
  
  const reference = claims.sub;
  let model: any = await model_utils.scope(Account, "account").findOne({ where: { reference } });
  if (!model) throw new AuthError("token");
  return { model, claims }
}
/**
 * Checks and authenticates the JWT in the Authorization HTTP header.
 * 
 * If JWT is valid, sets `claims` (JWT claims) and `self` (authenticated
 * account) to `req.extras`.
 * 
 * Middleware returns the authenticated account.
 * 
 * @returns middleware
 * 
 * @memberof Middleware
 */
export const authenticate = (optional = false) => {
  return make(async (req, res) => {
    try {

      let token = get_token(req)

      if (!token)
        throw new AuthError("auth");

      let { model, claims } = await parse_token(token)

      if (model.order === null) {
        // await SvOrder.create_order({ account_id: model.id }, { ip_address: req.attr?.ip });
        // model = await model_utils.scope(Account, "account").findByPk(model.id);
      }

      req.extras!.self = model;
      req.extras!.claims = claims;
      return model;
    } catch (error) {
      if (optional && error instanceof AuthError) return null;

      throw error;
    }
  });
};


export const public_authenticate = (optional: boolean = false) => {
  return make(async (req, res) => {
    try {

      let token = get_token(req)

      if (token) {
        let { model, claims } = await parse_token(token)
          
        req.extras!.self = model;
        req.extras!.claims = claims;
        return model;
      }
    } catch (error) {
      if (optional && error instanceof AuthError) return null;

      throw error;
    }
  });
};

export const actor_auth = () => {
  return make(async (req, res) => {
    let token_header = req.headers["authorization"];
    if (!token_header && req.query.access_token)
      token_header = `Bearer ${req.query.access_token}`;
    if (!token_header)
      throw new AuthError("auth");

    if (!token_header.match(/^Bearer [A-Za-z0-9\-\._~\+\/]+$/))
      throw new AuthError("token");

    const token = token_header.substr("Bearer ".length);
    const claims: JwtClaims = authenticate_claims(token);
    req.extras!.claims = claims;

    const reference = claims.sub;
    const model: any = await Account.findOne({ where: { reference } });
    if (!model)
      throw new AuthError("token");

    req.extras!.actor = model;
    return model;
  });
};

export const authenticate_page = () => {
  return make(async (req, res) => {
    let access_token = req.cookies?.["authorization"];
    if (req.query.access_token)
      access_token = req.query.access_token;
    if (!access_token)
      return null;

    let claims: JwtClaims | undefined;

    try {
      claims = authenticate_claims(access_token);
    } catch (error) {
      // eat error
      return;
    }

    const reference = claims!.sub;
    let model: any = await model_utils.scope(Account, "account").findOne({ where: { reference } });
    if (!model)
      return null;

    if (model.order === null) {
      // model.order = await SvOrder.create_order({ account_id: model.id }, { ip_address: req.attr?.ip });
      // model = await model_utils.scope(Account, "account").findByPk(model.id);
    }

    req.extras!.claims = claims;
    req.extras!.self = model;
    return model;
  });
};

/**
 * Validates credentials social & Returns account object
 * 
 * @param client_id - Login ID provided by authenticator
 * @param type - Type social by authenticator
 * 
 * @throws BadRequestError:invalid credentials - if credential is not valid.
 * 
 * @returns the account owning the authenticated credential.
 */
 export const validate_credentials_social = async (type: string,client_id: string ,email?: string) => {

  let where = {
    ...(
      email? { [Op.and] :[
        {email_address: email}
      ]}:null
    ),
    [Op.or]: [
      { facebook_id: client_id},
      { google_id: client_id},
    ]
  };
 
  const account = await Account.findOne({
    where,
  });

  if(account){
    const timestamp = moment();
    await account!.update({ last_logged_in: timestamp });
  }

  return account;
};
