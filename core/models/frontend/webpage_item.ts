import { QueryConfig, QueryOptions } from "@kidztime/middlewares";
import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";
import Product from "../product/product";
import Category from "../classification/category";

const sequelize = Datasource.source("default-db");
class WebpageItem extends CrudModel {
  static TABLENAME = "webpage_item";
  static Type = {
    Banner: "banner",
    ProductFeature: "product-feature",
    FeatureCarousel : "feature-carousel",
    CategoryFeature: "category-feature",
    ProductListing: "product-listing",
    CharacterSlider: "character-slider",
    ReviewSlider: "review-slider",
    Divider: "divider",
    PageDevider: 'page-divider',
    ProductContent: "product-content",
    MediaAttributes :"media-attributes",
    QuestionAnswerSlider: "question-answer-slider",
    BannerCarousel: "banner-carousel",
    ThreeTileCarousel: "three-tile-carousel",
    FourTileCarousel: "four-tile-carousel",
  } as const;
  static Position = {
    Before: "before",
    After: "after",
    Fixed: "fixed",
  } as const;
  static AssetAssoc = {
    Main: "main",
    FeatureBannerImage: "feature-banner-image",
    CarouselImage: "carousel-image",
    ProductContentImage : "product-content-image",
    DesktopBannerImage : "desktop-banner-image" ,
    MobileBannerImage : "mobile-banner-image",
    DesktopCarouselImage : "desktop-carousel-image",
    MobileCarouselImage : "mobile-carousel-image",
    DesktopFeatureCarouselImage : "desktop-feature-carousel-image",
    MobileFeatureCarouselImage : "mobile-feature-carousel-image",
  } as const;

  public webpage_id!: number | null;

  public type!: string | null;
  public position!: string | null;
  public options!: string | null;
  public link!: string | null;

  public products!: Product[] | null;
  public categories!: Category[] | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());

    if (values.assets)
      values.image = values.assets[0]?.uri;

    if (values.options) {
      try {
        values.options = JSON.parse(values.options);
      } catch (error) {}
    }

    return values;
  }
};

const hooks = {
  beforeValidate: ((model: WebpageItem) => {
  }),
};

WebpageItem.init({
  webpage_id: model_specs.foreign_key(),

  type: model_specs.enum(WebpageItem.Type),
  position: model_specs.enum(WebpageItem.Position),
  options: model_specs.text(),
  link: model_specs.text(),
}, {
  ...model_utils.model_defaults(WebpageItem.TABLENAME),
  defaultScope: {
    attributes: {
      exclude: ["created_at", "deleted_at"],
    },
  },
  hooks, sequelize,
});

WebpageItem.crud = new CrudSpec();
WebpageItem.crud.search = ["type"];
WebpageItem.crud.create = ["type"];
WebpageItem.crud.update = ["type","options","position","link"];
WebpageItem.crud.validators = {
  create: [
    validator.enumtype("type", Object.values(WebpageItem.Type)),
    validator.enumtype("position", Object.values(WebpageItem.Position)),
    validator.trim("link", { clean: true }),
  ],
  update: [
    validator.enumtype("type", Object.values(WebpageItem.Type)),
    validator.enumtype("position", Object.values(WebpageItem.Position), { optional: true }),
    validator.trim("link", { clean: true }),
  ],
};
WebpageItem.crud.filter.account = (config: QueryConfig) => {
  WebpageItem.crud.filter.default(config);

  QueryOptions.query_column(config, "webpage_id", "webpage");
  QueryOptions.query_column(config, "type");
};
WebpageItem.crud.filter.admin = (config: QueryConfig) => {
  WebpageItem.crud.filter.account(config);
};

export default WebpageItem;
