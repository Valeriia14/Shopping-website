import { Paths } from "@kidztime/constants";
import { render_page, Request, Response } from "@kidztime/middlewares";

export default render_page(Paths.Views.Summary,
  async (req: Request, res: Response) => {
    return {
      route_params: req.params,
    };
  },
);