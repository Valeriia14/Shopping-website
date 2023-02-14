import { PageElement, Paths } from "@kidztime/constants";
import { PageResponse, render_page, Request } from "@kidztime/middlewares";
import { Asset, Category, Product, Group, GroupProduct, InventoryItem, Webpage, WebpageItem, Account,ProductType } from "@kidztime/models";
import { SvFrontend } from "@kidztime/services";
import SvUGC from "@kidztime/services/ugc";
import { modify_product_response, get_product_info } from "@kidztime/services/product/product";
import { Transaction } from "sequelize/types";
import { Review, QuestionAnswer } from "@kidztime/models/ugc";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default render_page(Paths.Views.Product_Detail,
  async (req: Request, res: PageResponse) => {
    const opts: GenericOpts = {};
    const { transaction } = opts;

    const { product } = req.extras!;
    if(product){
      const full_product = await Product.findByPk(product.id, {
        include: [Category, ProductType ,{
          model: Asset,
          as: "PreviewImage",
        }, {
          model: Asset,
          as: "GalleryImages",
        }, {
          model: InventoryItem,
        }, {
          model: Group,
          as: "groups",
          include: [{
            model: GroupProduct,
            as: "products_of_group",
            include: [{
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
            }]
          }]
        }, {
          model: GroupProduct,
          include: [Group]
        }],
      });
  
      if (!full_product) return;
  
      const detail = await modify_product_response({ product: full_product, is_admin: false });
      detail.product_info = await get_product_info({product: full_product, is_admin: false, actor_id: 0 });
      
      const output: any = { product: detail };

      output.rating = await SvUGC.get_product_avg_rating(product.product_type_id);
      const reviews = await Review.findAll({
        where: {
          product_type_id: product.product_type_id,
          status: Review.STATUS.published,
          deleted_at: null
        },
        include:[
          {
            model: Account
          },
          {
            model : Asset,
            as: "assets"
          }
        ]
      })
      output.reviews = reviews

      const qas = await QuestionAnswer.findAll({
        where: {
          product_type_id: product.product_type_id
        },
        
      })
      output.qas = qas

      output.product_images = await Asset.findAll({
        where: {
          owner_type: Product.TABLENAME,
          owner_id: product?.id,
          assoc_type: Product.AssetGalleryImages,
        },
      });
  
      // const product_category = await Category.findOne({
      //   include: [{
      //     model: Product,
      //     required: true,
      //     where: { id: full_product.id },
      //   }],
      //   where: { type: Category.TYPE.product_type },
      //   transaction
      // });
  
      const similar_products = await Product.findAll({
        include: [
          Category,
          {
            model: ProductType,
            where: { id: product.product_type_id, customer_segment_dtl: detail?.product_type?.customer_segment_dtl || 0 },
            required: true,
          },
          {
            model: Asset,
            as: "PreviewImage",
          }],
      });
        output.similar_products = similar_products;

      const product_designs = await Product.findAll({
          include: [
            {
              model: Asset,
              as: "PreviewImage",
            }],
          where: {
            product_type_id: product.product_type_id ,
          },
        });
      output.product_designs = product_designs;


    const product_description = await Asset.findAll({
      where: {
        assoc_type: 'product_detail',
      },
      include: [{
        model: ProductType,
        required: true,
      }],
      order:[[ProductType,'name', 'DESC']]
    });
   output.product_description = product_description;

      res.page_meta.title = product?.name;
      
      const product_type = await Category.findOne({
        include: [
          {
            model: Product,
            required: true,
            where: { id: full_product.id },
          },
          {
            model: Webpage,
            as: "webpage",
            include: [{
              model: WebpageItem,
              as: 'webpage_items',
              include:[{
                model: Asset,
                as: 'assets'
              }]
            }]
          }
        ],
        where: { type: Category.TYPE.product_type },
        transaction
      })

      if (product_type?.webpage?.webpage_items) {
        await Promise.all(product_type.webpage?.webpage_items.map(item => {
          if (item.type === 'feature-carousel') return SvFrontend.load_element(item);
        }))
      }

      res.elements.push(await SvFrontend.gen_element(WebpageItem.Type.ReviewSlider, {
        category_id: product_type?.id
      } as PageElement.ReviewSliderOpts));
      
      res.elements.push(await SvFrontend.gen_element(WebpageItem.Type.QuestionAnswerSlider, {
        category_id: product_type?.id
      } as PageElement.ReviewSliderOpts));


      return {
        ...output,
        category: product_type
      }
    }
    else {
      return {}
    }
  },
);
