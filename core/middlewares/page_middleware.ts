import { NextFunction, Request as ExpressRequest, RequestHandler, Response as ExpressResponse } from "express";
import { MiddleHandler, MiddlewareError, PageResponse, middleware_error_handler } from "./middleware";

export const make_page_middleware = (serve: MiddleHandler<ExpressRequest, PageResponse>): RequestHandler => {
  if (typeof serve !== "function")
    throw new MiddlewareError("invalid serve function");

  return (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const result = serve(req, res as PageResponse);
    return Promise.resolve(result)
      .then(() => next())
      .catch(middleware_error_handler(req, res, next));
  };
};
