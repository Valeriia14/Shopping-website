import { controller, Request, Response } from "@kidztime/middlewares";
import { SvClassification } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.trim("handle", { clean: true }),
], async (req: Request, res: Response) => {
  const { self, product_type } = req.extras!;
  const { name, description, handle, meta_keywords, meta_title, min_age, max_age, published, asset_id} = req.body;
  let { extras } = req.body;
  const timestamp = new Date()
  extras = JSON.stringify({ extras });

  const updated_product_type= await SvClassification.update_product_type({
    product_type, name, description, handle, meta_keywords,
    meta_title, extras, actor_id: self.id, min_age, max_age, published,
    published_at! : (published && published !== product_type.published) ? timestamp : product_type.published_at, asset_id 
  }, { ip_address: req.attr?.ip });

  res.result = updated_product_type;
});
