import { controller, Request, Response } from "@kidztime/middlewares";
import { ProductType } from "@kidztime/models";
import { Op } from "sequelize";

export default controller(async (req: Request, res: Response) => {
  let { category_id, product_type_id } = req.body;
  const result = await ProductType.update(
    {
      category_id: null,
    },
    { where: { category_id, id: { [Op.notIn]: product_type_id } } }
  );
  res.result = {
    message: "category disconnect to product type successfully!",
  };
});
