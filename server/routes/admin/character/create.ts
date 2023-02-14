import { controller, Request, Response } from "@kidztime/middlewares";
import { Character } from "@kidztime/models";
import { SvClassification } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.required("name"),
  validator.trim("handle", { clean: true }),
], async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const { name, description, handle, meta_keywords, meta_title, published, gender } = req.body;
  let { extras } = req.body;
  let timestamp = new Date()
  extras = JSON.stringify({ extras });

  const category = await SvClassification.create_character({
    type: Character.TYPE,
    name, description, handle, meta_keywords,
    meta_title, extras, actor_id: self.id, published , published_at! : published? timestamp : null , gender
  }, { ip_address: req.attr?.ip });

  res.result = category;
});
