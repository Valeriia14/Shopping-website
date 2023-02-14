import { Paths } from "@kidztime/constants";
import { PageRequest, PageResponse, render_page } from "@kidztime/middlewares";
import { Transaction } from "sequelize/types";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default render_page(Paths.Views.Character,
  async (req: PageRequest, res: PageResponse) => {
    const character = req.extras!.character;
    // const { preview, basic_attr } = req.query;

    if(character){
      return {
        character,
      };
    }
    else {
      return {};
    }
  },
);
