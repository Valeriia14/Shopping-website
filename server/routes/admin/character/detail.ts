import { CategoryLink, InventoryItem, WebpageItem } from "@kidztime/models";
import { Asset, Webpage, Product, Character } from "@kidztime/models";
import { controller, Request, Response } from "@kidztime/middlewares";

export default controller([], async (req: Request, res: Response) => {
  const options = req.parse_query!();
  const id = req.params.character_id;
  options.where = {
    id,
  };
  // No include Order Item here because sequelize generates wrong query with order item
  options.include = [
    {
      model: Webpage,
      as: "webpage",
      include: [
        {
          model: WebpageItem,
          as: "webpage_items",
          include: [
            {
              model: Asset,
              as: "assets",
            },
          ],
        },
      ],
    },
    {
      model: Asset,
      as: "assets",
    },
    {
      model: Product,
      include: [
        Character,
        {
          model: Asset,
          as: "PreviewImage",
        },
        {
          model: Asset,
          as: "GalleryImages",
        },
        {
          model: InventoryItem,
        },
      ],
    },
  ];

  const character = await Character.findOne({
    ...options,
  });

  res.result.model = character;
});
