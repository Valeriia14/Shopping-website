import { InventoryItem, ProductType, WebpageItem } from '@kidztime/models';
import { Asset, Webpage, Product, Category, ProductInfo } from '@kidztime/models';
import { controller, Request, Response } from "@kidztime/middlewares";

export default controller([], async (req: Request, res: Response) => {
  const options = req.parse_query!();
  const id = req.params.category_id
  options.where = {
    id
  };
  // No include Order Item here because sequelize generates wrong query with order item
  options.include = [{
      model: Webpage,
      as: 'webpage',
      include: [{
        model: WebpageItem,
        as: 'webpage_items',
        include:[{
          model: Asset,
          as: 'assets'
        }]
      }]
    },
    {
      model: Asset,
      as: "assets"
    },
    // {
    //   model: CategoryLink,
    //   as: "parent",
    //   include:[
    //     {
    //       model: Category,
    //       as: "child"
    //     }
    //   ]
    // },
    {
      model: ProductType,
    },
    {  
      model: Product,
      include: [Category, {
        model: Asset,
        as: "PreviewImage",
      }, {
        model: Asset,
        as: "GalleryImages",
      }, {
        model: InventoryItem,
      }]
    }
  ];

  const category = await Category.findOne({
    ...options,
  });

  res.result.model = category;
});
