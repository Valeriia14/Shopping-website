import { controller, Request, Response } from "@kidztime/middlewares";
import { SvClassification } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.trim("handle", { clean: true }),
], async (req: Request, res: Response) => {
  const { self, category } = req.extras!;
  const { name, description, handle, meta_keywords, meta_title, min_age, max_age } = req.body;
  let { extras } = req.body;

  extras = JSON.stringify({ extras, min_age, max_age });

  const updated_category = await SvClassification.update_category({
    category, name, description, handle,
    meta_keywords, meta_title, extras,
    actor_id: self.id
  }, { ip_address: req.attr?.ip });

  res.result = updated_category;
});
