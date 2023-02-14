import { controller, Request, Response } from "@kidztime/middlewares";
import { Category } from "@kidztime/models";
import { SvClassification } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.required("name"),
  validator.trim("handle", { clean: true }),
], async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const { name, description, handle, meta_keywords, meta_title, min_age, max_age, published } = req.body;
  let { extras } = req.body;
  let timestamp = new Date()

  extras = JSON.stringify({ extras, min_age, max_age });

  const category = await SvClassification.create_category({
    type: Category.TYPE.product_type,
    name, description, handle, meta_keywords,
    meta_title, extras, actor_id: self.id, published , published_at! : published? timestamp : null
  }, { ip_address: req.attr?.ip });

  res.result = category;
});
