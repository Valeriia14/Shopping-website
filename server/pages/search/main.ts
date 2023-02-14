import { PageElement, Paths } from "@kidztime/constants";
import { PageRequest, PageResponse, render_page } from "@kidztime/middlewares";
import { Asset, Category, CategoryProduct, Product, WebpageItem } from "@kidztime/models";
import { SvFrontend } from "@kidztime/services";
import { Op } from "sequelize";

export default render_page(Paths.Views.Search,
  async (req: PageRequest, res: PageResponse) => {
    const searchTerm = req.query.search;

    if (!searchTerm){
      return {
        products : [],
        searchTerm
      };
    }

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: '%' + searchTerm + '%' } },
          { sku: { [Op.like]: '%' + searchTerm + '%' } },
          { upc: { [Op.like]: '%' + searchTerm + '%' } },
          { '$category_has_products.category.name$': { [Op.like]: '%' + searchTerm + '%' } },
        ]
      },
      include: [{
        model: Asset,
        as: "PreviewImage",
      }, {
        model: CategoryProduct,
        as: 'category_has_products',
        include: [{
          model: Category,
          include: [{
            model: Asset,
            as: "assets"
          }],
          as: 'category',
        }],
      }],
      subQuery: false,
      limit: 50,
    });

    for (const product of products) {
      const data = product.dataValues;
      if (data.category_has_products.length) {
        const character = data.category_has_products.find(c => c.category && c.category.type == Category.TYPE.character);
        data.character = character && character.category;
        delete data.category_has_products;
      }
    }

    return {
      products,
      searchTerm,
    };
  },
);
