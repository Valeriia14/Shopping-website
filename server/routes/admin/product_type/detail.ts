import { InventoryItem, WebpageItem, Category } from "@kidztime/models";
import { Asset, Webpage, Product, ProductType } from "@kidztime/models";
import { controller, Request, Response } from "@kidztime/middlewares";
import { Review, QuestionAnswer } from "@kidztime/models/ugc";

export default controller([], async (req: Request, res: Response) => {
  const options = req.parse_query!();
  const id = req.params.producttype_id;
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
      model: Category,
    },
    {
      model: Asset,
      as: "assets",
    },
    {
      model: Review,
      as: "reviews",
    },
    {
      model: QuestionAnswer,
      as: "question_answers",
    },
    {
      model: Product,
      include: [
        ProductType,
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

  const producttype = await ProductType.findOne({
    ...options,
  });

  res.result.model = producttype;
});
