export class GenericError extends Error {
  extras?: any;
  constructor(message: string, extras?: any) {
    super(message);
    this.extras = extras;
  }
};

export class ServerError extends GenericError { }

export class RequestError extends GenericError {
  code?: number;
  constructor(code: number, message: string, extras?: any) {
    super(message, extras);
    this.code = code;
  }
};

export class BadRequestError extends RequestError {
  constructor(message: string, extras?: any) {
    super(400, message, extras);
  }
};

export class ValidationError extends BadRequestError {
  constructor(errors: any) {
    super("validation error", errors);
  }
};

export class AuthError extends RequestError {
  constructor(type: string, extras?: any) {
    let message = "unauthorised";
    switch (type) {
      case "auth": message = "unauthorised:authorisation required"; break;
      case "token expired": message = "unauthorised:token expired"; break;
      case "account": message = "unauthorised:no active account"; break;
      case "token": message = "unauthorised:invalid token"; break;
      case "invalidated": message = "unauthorised:token invalidated"; break;
      case "privilege": message = "unauthorised:privilege required"; break;
    }
    super(401, message, extras);
  }
};