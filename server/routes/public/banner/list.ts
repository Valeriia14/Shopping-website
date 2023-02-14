import { controller, Request, Response } from "@kidztime/middlewares";
import { Asset, Category, ObjectMeta } from "@kidztime/models";

export default controller(async (req: Request, res: Response) => {
  const banners = await ObjectMeta.findAll({
    where: {
      key: ObjectMeta.KEY.banner,
    },
    order: [["extra0", "ASC"]],
  });
  const all_banners = [];

  for (const banner of banners) {
    const category_ids = JSON.parse(banner.extra1!);

    const categories = await Category.findAll({
      where: {
        id: category_ids,
      },
      include: [{
        model: Asset,
        as: 'assets'
      }],
    });

    all_banners.push({
      banner,
      categories,
    });
  };

  res.result.models = all_banners;
});
