import { controller, Request, Response } from "@kidztime/middlewares";
import { WebpageItem, Asset, Webpage } from "@kidztime/models";
import { Op } from "sequelize";

export default controller(async (req: Request, res: Response) => {
  const webpage = req.extras!.webpage?.dataValues;
  //webpageitem_ids need to delete
  const webpage_items: WebpageItem[] = await WebpageItem.findAll({
    where: {
      webpage_id: webpage.id,
    },
  });
  const webpage_item_ids = webpage_items.map((item: WebpageItem) => item.id);

  //Asset_ids need to delete
  const assets: Asset[] = await Asset.findAll({
    where: {
      owner_id: { [Op.in]: webpage_item_ids },
    },
  });
  const assets_ids = assets.map((asset: Asset) => asset.id);
  const RESULTS = await Promise.all([
    // remove assets
    Asset.destroy({
      where: {
        id : {[Op.in]: assets_ids }
      },
    }),
    // remove webpage_items
    WebpageItem.destroy({
      where: {
        id : {[Op.in]: webpage_item_ids }
      },
    }),
    // remove webpage
    Webpage.destroy({
      where: {
        id : webpage.id
      },
    }),
  ])
});
