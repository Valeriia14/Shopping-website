import { Paths } from "@kidztime/constants";
import { render_page } from "@kidztime/middlewares";
import { Asset, Category, CategoryProduct, Product } from "@kidztime/models";

export default render_page(Paths.Views.Product_List, async (req, res) => {
  const products = await Product.findAll({
    include: [{
      model: Asset,
      as: "PreviewImage",
    }, {
      model: CategoryProduct,
      include: [{
        model: Category,
        include: [{
          model: Asset,
          as: "assets"
        }],
        where: { type: Category.TYPE.character },
      }],
    }],
    limit: 20,
  });

  for (const product of products) {
    const data = product.dataValues
    if (data.category_has_products.length) {
      data.character = data.category_has_products[0].category;
      delete data.category_has_products;
    }
  }

  return {
    products,
  };
});
