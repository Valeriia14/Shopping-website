import { cruder, controller, Request, Response } from "@kidztime/middlewares";
import { SvClassification, SvFrontend } from "@kidztime/services";
import { format_path, validator } from "@kidztime/utilities";
import { transact, Webpage , WebpageItem } from "@kidztime/models";


export default controller([
  validator.required(["category_body"]),
  validator.required(["page_setting_body", "page_setting_body.webpage_id"]),
  validator.trim("category_body.handle", { clean: true }),
  validator.trim("page_setting_body.path", { clean: true }),
], async (req: Request, res: Response) => {
  const updated = await transact().run(async (transaction) => {
    const { self, product_type } = req.extras!;

    const { category_body, page_setting_body , feature_carousel_body } = req.body;

    const timestamp = new Date()


    // update category
    const { name, description, meta_keywords, meta_title, type, published, min_age, max_age, asset_id } = category_body;
    const { webpage_id, path } = page_setting_body;
    const { options } = feature_carousel_body
    let { extras } = category_body;
    extras = JSON.stringify(extras);


    const updated_product_type = await SvClassification.update_product_type({
      product_type, name, description, handle : path, meta_keywords,
      meta_title, type, extras, actor_id: self.id, published,
      published_at! : published? timestamp : null, asset_id, min_age, max_age
    }, { ip_address: req.attr?.ip, transaction });


    // update webpage
    const webpage = await Webpage.findByPk(webpage_id);
    await cruder.processor(
      webpage,
      { ...page_setting_body, path: format_path(type, page_setting_body.path) },
      Webpage.crud.update
    );
    await webpage!.save({transaction});

    // update webpage_item
    const webpage_item : WebpageItem = await WebpageItem.findOne({
      where: {
        webpage_id: webpage_id,
        type: WebpageItem.Type.FeatureCarousel
      },
      transaction,
    });
    const updated_webpage_item = await SvFrontend.update_webpage_item({
      webpage_item, options
    }, { ip_address: req.attr?.ip, transaction });

    return {
      updated_product_type,
      webpage,
      updated_webpage_item
    };
  })


  res.result = updated;
});
