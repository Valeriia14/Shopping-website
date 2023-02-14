import { controller, Request, Response } from "@kidztime/middlewares";
import { SvClassification } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.trim("handle", { clean: true }),
], async (req: Request, res: Response) => {
  const { self, category } = req.extras!;
  const { name, description, handle, meta_keywords, meta_title, type, published, asset_id } = req.body;
  let { extras } = req.body;
  const timestamp = new Date()
  extras = JSON.stringify(extras);

  const updated_category = await SvClassification.update_category({
    category, name, description, handle, meta_keywords,
    meta_title, type, extras, actor_id: self.id, published,
    published_at! : (published && published !== category.published) ? timestamp : category.published_at, asset_id
  }, { ip_address: req.attr?.ip });

  res.result = updated_category;
});
