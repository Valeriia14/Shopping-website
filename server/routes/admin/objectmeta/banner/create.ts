import { controller, Request, Response } from "@kidztime/middlewares";
import SvMetadata from "@kidztime/services/metadata";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.required(["ordering", "title"]),
  validator.number(["ordering"]),
], async (req: Request, res: Response) => {
  const { ordering, title } = req.body;
  let { categories } = req.body;

  categories = JSON.stringify(categories);
  const banner_item = await SvMetadata.create_banner_item({ value: title, extra0: ordering, extra1: categories }, { ip_address: req.attr?.ip });

  res.result = banner_item;
});
