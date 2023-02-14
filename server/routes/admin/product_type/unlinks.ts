import { controller, Request, Response } from "@kidztime/middlewares";
import { ProductType } from "@kidztime/models";
import { Op } from "sequelize";

export default controller(async (req: Request, res: Response) => {
  let { category_id, product_type_id } = req.body;
  console.log(category_id, product_type_id);
  const result = await ProductType.update(
    {
      category_id: null,
    },
    { where: { id: product_type_id } }
  );
  res.result = {
    message: "Product type disconnect to category successfully!",
  };
});
