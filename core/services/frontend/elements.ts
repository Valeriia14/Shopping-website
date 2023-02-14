import { PageElement } from "@kidztime/constants";
import { Account, Asset, Category, CategoryProduct, Product, transact, WebpageItem } from "@kidztime/models";
import { try_json, ValueOf } from "@kidztime/utilities";
import { GenericOpts } from "../types";
import { Op } from "sequelize";
import { cruder } from "@kidztime/middlewares";
import { Review, QuestionAnswer } from "@kidztime/models/ugc";

type UpdateWebpageItemProps = {
  webpage_item: WebpageItem;
  options : string | null;
};

const find_category_product_ids = async (category_id: number, limit: number = 10, opts: GenericOpts = {}) => {
  const products = await Product.findAll({
    include: [{
      model: CategoryProduct,
      where: { category_id },
      required: true,
    }],
    attributes: ["id"],
    limit,
  });

  return products.map((model) => model.id);
};

export const gen_element = async <T extends PageElement.DefaultElementOpts>(
  type: ValueOf<typeof WebpageItem.Type>, 
  options: T,
  opts: GenericOpts = {},
): Promise<WebpageItem> => {
  const element = new WebpageItem({
    type,
    options: typeof options === "string" ? options : JSON.stringify(options),
  });

  await load_element(element, opts);

  return element;
};

export const load_element = async (element: WebpageItem, opts: GenericOpts = {}) => {
  element.image = element.asset?.uri;
  element.dataValues.image = element.asset?.uri;
  let options = try_json(element.options);
  await transact(opts.transaction).run(async (transaction) => {
    switch (element.type) {

      case WebpageItem.Type.Banner: {
        const {img_mob, img_desk} = options;
        const assets = await Asset.findAll({
          where: {
            id: { [Op.in]: [img_mob, img_desk] },
          },
          transaction,
        });
        options.img_desk = assets.find(a =>  a.id == img_desk)?.uri;
        options.img_mob = assets.find(a =>  a.id == img_mob)?.uri;

        element.setDataValue("options", options);

        return;
      };

      case WebpageItem.Type.BannerCarousel: {
        const asset_id_desk = options.map((opt:any) => opt.img_desk);
        const asset_id_mob = options.map((opt:any) => opt.img_mob);

        const assets = await Asset.findAll({
          where: {
            id: { [Op.in]: [...asset_id_desk, ...asset_id_mob] },
          },
          transaction,
        });

        options.forEach((opt: any) => {
          opt.img_desk = assets.find(a => a.id == opt.img_desk)?.uri;
          opt.img_mob = assets.find(a => a.id == opt.img_mob)?.uri;
        });

        element.setDataValue("options", options);
        return;
      };

      case WebpageItem.Type.FeatureCarousel: {
        const images = options?.images ?? [];
        const { feature_banner } = options;
        const asset_ids = images.map((img: any) => img.asset);

        const assets = await Asset.findAll({
          where: {
            id: { [Op.in]: [...asset_ids, feature_banner] },
          },
          transaction,
        });

        images.forEach((opt: any) => {
          opt.asset = assets.find(a => a.id == opt.asset)?.uri;
        });
        options.feature_banner = assets.find(a => a.id == feature_banner)?.uri;
        options.images = images;

        element.setDataValue("options", options);

        return;
      };

      case WebpageItem.Type.ThreeTileCarousel: {
        const asset_ids = options.map((opt: any) => opt.image);

        const assets = await Asset.findAll({
          where: {
            id: { [Op.in]: asset_ids },
          },
          transaction,
        });

        options.forEach((opt: any) => {
          opt.image = assets.find(a => a.id == opt.image)?.uri;
        });

        element.setDataValue("options", options);
        return;
      };

      case WebpageItem.Type.FourTileCarousel: {
        const asset_ids = options.map((opt: any) => opt.image);

        const assets = await Asset.findAll({
          where: {
            id: { [Op.in]: asset_ids },
          },
          transaction,
        });

        options.forEach((opt: any) => {
          opt.image = assets.find(a => a.id == opt.image)?.uri;
        });

        element.setDataValue("options", options);
        return;
      };

      case WebpageItem.Type.ProductFeature: {
        const category_id = options.category_id ?? 0;
        const product_ids = await find_category_product_ids(category_id, 10, { transaction });
        const products = await Product.scope("public_listing").findAll({
          where: { id: product_ids },
          transaction,
        });
        element.products = products;
        element.dataValues.products = products;
        return;
      };

      case WebpageItem.Type.ReviewSlider:{
        const category_id = options.category_id ?? 0;
        const reviews = await Review.findAll({
          where:{
            // category_id: category_id
          },
          include:[
            Account, 
            {
              model: Product,
              include:[
                {
                  model: Asset,
                  as: "PreviewImage"
                }
              ]
            }
          ],
          transaction
        })
        element.reviews = reviews;
        element.dataValues.reviews = reviews;
        return
      };

      case WebpageItem.Type.QuestionAnswerSlider :{
        const category_id = options.category_id ?? 0;
        const question_answers = await QuestionAnswer.findAll({
          where:{
            // category_id: category_id
          },
          transaction
        })
        element.question_answers = question_answers;
        element.dataValues.question_answers = question_answers;
        return
      };
      
      case WebpageItem.Type.CategoryFeature: {
        const category_ids = options.category_list ?? [];
        const categories = await Category.scope("public").findAll({
          where: { id: category_ids },
          transaction,
        });
        element.categories = categories;
        element.dataValues.categories = categories;
        return;
      };
      
      case WebpageItem.Type.CharacterSlider: {
        const categories = await Category.scope("public").findAll({
          where: { type: Category.TYPE.character },
          transaction,
        });
        element.categories = categories;
        element.dataValues.categories = categories;
        return;
      };
    }
  })
};

export const update_webpage_item =  async (props: UpdateWebpageItemProps, opts: GenericOpts = {}) => {
  const updated_webpageItem = await transact(opts.transaction).run(async (transaction) => {
    const { webpage_item, options } = props
    const newOptions = options ? JSON.parse(options) : {};
    const { feature_banner, images } = newOptions
    const carousel_asset_ids = images.map((i:any) => i.asset);
    const webpageItem = await cruder.processor(webpage_item, {options}, WebpageItem.crud.update);
      await webpageItem.save({transaction});
    if ([feature_banner, ...carousel_asset_ids].length > 0){
      // remove not needed assets
      const RESULTS = await Promise.all([
        Asset.destroy({
          where: {
            owner_type: WebpageItem.name,
            owner_id: webpage_item.id,
            assoc_type: { [Op.in]: [WebpageItem.AssetAssoc.FeatureBannerImage, WebpageItem.AssetAssoc.CarouselImage] },
            id: { [Op.notIn]: [feature_banner, ...carousel_asset_ids] }
          },
          transaction
        }),

        // update feature banner images
        Asset.update({
          owner_type: WebpageItem.name,
          owner_id: webpage_item.id,
          assoc_type: WebpageItem.AssetAssoc.FeatureBannerImage,
        }, {
          where: {
            id: feature_banner
          },
          transaction
        }),

        // update carousel images
        Asset.update({
          owner_type: WebpageItem.name,
          owner_id: webpage_item.id,
          assoc_type: WebpageItem.AssetAssoc.CarouselImage,
        }, {
          where: {
            id: { [Op.in]: carousel_asset_ids }
          },
          transaction
        })
      ])
    }
  return webpageItem
  })
  return updated_webpageItem
}