import { BadRequestError } from "@kidztime/errors";
import { controller, cruder, Request, Response, validate } from "@kidztime/middlewares";
import { Category, CategoryLink } from "@kidztime/models";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.required(["parent_id", "child_id"]),
  validator.number(["parent_id", "child_id"]),
], async (req: Request, res: Response) => {

  const existing_link = await CategoryLink.findOne({
    where: {
      parent_id: req.body.parent_id,
      child_id: req.body.child_id,
    }
  });
  if (existing_link) throw new BadRequestError("category link exists");

  // req.body.type = Category.TYPE.product_type;
  const category = await cruder.processor(new CategoryLink, req.body, CategoryLink.crud.create);
  await category.save();
  res.result = category;
});
