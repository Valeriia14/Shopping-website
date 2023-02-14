import { Paths } from "@kidztime/constants";
import { ValueOf } from "@kidztime/utilities";
import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from "express";
import { PageRequest, PageResponse } from "./middleware";

type Pages = ValueOf<typeof Paths.Views>;

export type PageHandler = (req: PageRequest, res: PageResponse) => Promise<any> | any;

export const render_page = (page: Pages, handler?: PageHandler) => {
  return async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const page_res = res as PageResponse;
    const page_req = req as PageRequest;

    const cart = page_req.extras!.cart;
    const elements = page_res.elements;

    let result: any = await handler?.(page_req, page_res) ?? {};

    res.render(page, {
      preloaded_data: {
        ...page_res.page_data,
        ...cart && { cart },
        ...JSON.parse(JSON.stringify(result)),
      },
      page_elements: elements,
      page_override: page_req.page_override,
      page_meta: page_res.page_meta,
      self: page_req.extras!.self,
    });
  };
};
