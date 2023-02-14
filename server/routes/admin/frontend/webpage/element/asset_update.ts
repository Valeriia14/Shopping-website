import { make, Request, Response } from "@kidztime/middlewares";
import { WebpageItem, Asset } from "@kidztime/models";
import { Op } from "sequelize";

export default make(async (req: Request, res: Response) => {
  const { options } = req.body;
  const { feature_banner=null, images=null, product_content_images=null, img_desk=null, img_mob=null } =
    options ? JSON.parse(options) : {};
  const webpage_item = req.extras!.webpage_item;
  const carousel_asset_ids = images ? images.map((i: any) => i.asset) : [];
  const feature_banner_id = [feature_banner] || [];
  const product_content_images_id = product_content_images || [];
  const img_desk_ids =
    JSON.parse(options)?.length > 0
      ? JSON.parse(options).map((i: any) => i.img_desk)
      : [];
  const img_mob_ids =
    JSON.parse(options)?.length > 0
      ? JSON.parse(options).map((i: any) => i.img_mob)
      : [];
  const img_ids =
    JSON.parse(options)?.length > 0
      ? JSON.parse(options).map((i: any) => i.image)
      : [];
  const arr_ids = [
    ...feature_banner_id,
    ...carousel_asset_ids,
    ...product_content_images_id,
    img_desk,
    img_mob,
    ...img_desk_ids,
    ...img_mob_ids,
    ...img_ids,
  ].filter((i: any) => i);
  if (arr_ids?.length > 0) {
    const RESULTS = await Promise.all([
      // remove not needed assets
      Asset.destroy({
        where: {
          owner_type: WebpageItem.name,
          owner_id: webpage_item.id,
          assoc_type: {
            [Op.in]: [
              WebpageItem.AssetAssoc.FeatureBannerImage,
              WebpageItem.AssetAssoc.CarouselImage,
              WebpageItem.AssetAssoc.ProductContentImage,
              WebpageItem.AssetAssoc.DesktopBannerImage,
              WebpageItem.AssetAssoc.MobileBannerImage,
              WebpageItem.AssetAssoc.DesktopCarouselImage,
              WebpageItem.AssetAssoc.MobileCarouselImage,
              WebpageItem.AssetAssoc.CarouselImage,
            ],
          },
          id: {
            [Op.notIn]: arr_ids,
          },
        },
      }),

      // update feature banner images
      Asset.update(
        {
          owner_type: WebpageItem.name,
          owner_id: webpage_item.id,
          assoc_type: WebpageItem.AssetAssoc.FeatureBannerImage,
        },
        {
          where: {
            id: feature_banner_id,
          },
        }
      ),

      // update carousel images
      Asset.update(
        {
          owner_type: WebpageItem.name,
          owner_id: webpage_item.id,
          assoc_type: WebpageItem.AssetAssoc.CarouselImage,
        },
        {
          where: {
            id: { [Op.in]: carousel_asset_ids },
          },
        }
      ),

      // update product content images
      Asset.update(
        {
          owner_type: WebpageItem.name,
          owner_id: webpage_item.id,
          assoc_type: WebpageItem.AssetAssoc.ProductContentImage,
        },
        {
          where: {
            id: { [Op.in]: product_content_images_id },
          },
        }
      ),
      // update banner images
      Asset.update(
        {
          owner_type: WebpageItem.name,
          owner_id: webpage_item.id,
          assoc_type: WebpageItem.AssetAssoc.DesktopBannerImage,
        },
        {
          where: {
            id: [img_desk],
          },
        }
      ),
      Asset.update(
        {
          owner_type: WebpageItem.name,
          owner_id: webpage_item.id,
          assoc_type: WebpageItem.AssetAssoc.MobileBannerImage,
        },
        {
          where: {
            id: [img_mob],
          },
        }
      ),
      // update banner images
      Asset.update(
        {
          owner_type: WebpageItem.name,
          owner_id: webpage_item.id,
          assoc_type: WebpageItem.AssetAssoc.DesktopCarouselImage,
        },
        {
          where: {
            id: { [Op.in]: img_desk_ids },
          },
        }
      ),
      Asset.update(
        {
          owner_type: WebpageItem.name,
          owner_id: webpage_item.id,
          assoc_type: WebpageItem.AssetAssoc.MobileCarouselImage,
        },
        {
          where: {
            id: { [Op.in]: img_mob_ids },
          },
        }
      ),
      // update tile images
      Asset.update(
        {
          owner_type: WebpageItem.name,
          owner_id: webpage_item.id,
          assoc_type: WebpageItem.AssetAssoc.CarouselImage,
        },
        {
          where: {
            id: { [Op.in]: img_ids },
          },
        }
      ),
    ]);
  }
});
