import { make, PageResponse, Request, Response } from "@kidztime/middlewares";
import { Asset, Webpage, WebpageItem } from "@kidztime/models";
import { SvFrontend } from "@kidztime/services";
import { chirp } from "@kidztime/utilities";
import moment from "moment";
import { PageRequest } from "./middleware";
import { Op } from "sequelize";

export const prepare_page = () => {
  return make(async (req: Request, res: Response) => {
    chirp("m: prepare_page", req.path);

    const page_response = res as PageResponse;
    const page_request = req as PageRequest;

    page_request.extras = {};
    page_request.attr = {};

    page_response.elements = [];

    const path = req.originalUrl;
    const webpage = await Webpage.findOne({
      where: { path },
      include: [{
        model: WebpageItem,
        where: {
          position: { [Op.in]: [WebpageItem.Position.Before, WebpageItem.Position.After] }
        },
        include: [{
          model: Asset,
          as: "assets"
        }],
      }]
    });

    if (webpage) {
      page_request.page_override = webpage;
      if (webpage.webpage_items) {
        webpage.items = webpage.webpage_items;
        await Promise.all(webpage.items.map(item => {
          return SvFrontend.load_element(item);
        }))
        for (const item of webpage.items){
          page_response.elements.push(item);
        }
      }
    }

    page_response.page_data = {
      timestamp: moment().unix(),
    };
    page_response.page_meta = {
      title: "Kidztime | Shop School Supplies Singapore",
    };
  });
};
