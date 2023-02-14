import { Paths } from "@kidztime/constants";
import { PageRequest, PageResponse, render_page } from "@kidztime/middlewares";
import { Transaction } from "sequelize/types";
import {  Asset,ProductType } from "@kidztime/models";
export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default render_page(Paths.Views.Product_Type,
  async (req: PageRequest, res: PageResponse) => {
    const product_type = req.extras!.product_type;
    const header_desktop =  await Asset.findAll({
      where: {
        assoc_type: 'header_desktop',
      },
      include: [{
        model: ProductType,
        required: true,
      }],
    });

    const header_mobile =  await Asset.findAll({
      where: {
        assoc_type: 'header_mobile',
      },
      include: [{
        model: ProductType,
        required: true,
      }],
      order:[['updated_at', 'DESC']]
    });
 
    if(product_type){
      return {
        product_type,
        header_desktop,
        header_mobile
      };
    }
    else {
      return {};
    }
  },
);
