import { controller, Request, Response } from "@kidztime/middlewares";
import { SvClassification } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.trim("handle", { clean: true }),
], async (req: Request, res: Response) => {
  const { self, character } = req.extras!;
  const { name, description, handle, meta_keywords, meta_title, gender, published, asset_id } = req.body;
  let { extras } = req.body;
  const timestamp = new Date()
  extras = JSON.stringify({ extras });

  const updated_category = await SvClassification.update_character({
    character, name, description, handle, meta_keywords,
    meta_title, extras, actor_id: self.id, published,
    published_at! : (published && published !== character.published) ? timestamp : character.published_at, asset_id 
  }, { ip_address: req.attr?.ip });

  res.result = updated_category;
});
