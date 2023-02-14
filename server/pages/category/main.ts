import { Paths } from "@kidztime/constants";
import { PageRequest, PageResponse, render_page } from "@kidztime/middlewares";
import { Transaction } from "sequelize/types";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default render_page(Paths.Views.Category,
  async (req: PageRequest, res: PageResponse) => {
    const category = req.extras!.category;
    // const { preview, basic_attr } = req.query;
    if(category){
      return {
        category,
      };
    }
    else {
      return {};
    }
  },
);
