import { controller, Request, Response } from "@kidztime/middlewares";
import { ProductType } from "@kidztime/models";
import { Op } from "sequelize";

export default controller(async (req: Request, res: Response) => {
  let { category_id, product_type_ids } = req.body;
  const result = await ProductType.update(
    {
      category_id: category_id,
    },
    { where: { id: { [Op.in]: product_type_ids } } }
  );
  res.result = {
    message: "Set category Link to product type successfully!"
  }
});
