import { make, Request, Response } from "@kidztime/middlewares";
import { Category, Webpage } from "@kidztime/models";
import { format_path } from "@kidztime/utilities";

export const build_path = () => {
  return make(async (req: Request, res: Response) => {
    const id = req.params.webpage_id
    const webpage = await Category.findOne({
      include: [{
        model: Webpage,
        as: "webpage",
        where: { id },
      }]
    });

    if (webpage) {
      req.body.path = format_path(webpage.type, req.body.path);
    }
  });
};
