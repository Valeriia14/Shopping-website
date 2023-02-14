import { QueryConfig, QueryOptions } from "@kidztime/middlewares";
import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";
import { Category, Group, GroupProduct, ProductGroup } from "../classification";
import { InventoryItem } from "../inventory";
import Asset from "../misc/asset";
import config from "@kidztime/config";

const sequelize = Datasource.source("default-db");

class Product extends CrudModel {
  static TABLENAME = "product";
  static Status = {
    Draft: "draft",
    Published: "published",
    Archived: "archived",
    Unavilable: "unavailable",
    ReadyForSale: "ready-for-sale",
    OutOfStock: "out-of-stock",
  } as const;
  static AssetPreviewImage = "preview";
  static AssetGalleryImages = "gallery";
  static Inventory = "inventory";

  public reference!: string | null;
  public handle!: string | null;
  public name!: string | null;
  public alt_name!: string | null;
  public sku!: string | null;
  public upc!: string | null;
  public material!: string | null;

  public stock!: number | null;

  public status!: string | null;

  public price!: number | null;
  public promo_price!: number | null;

  public features!: string[] | null;
  public certificates!: string[] | null;
  public materials!: string[] | null;
  public is_new!: boolean | null;
  public is_sale!: boolean | null;
  public has_gift!: boolean | null;
  public category_id!: number | null;
  public character_id!: number | null;
  public product_type_id!: number | null;
  public has_accessory!: number | null;
  // associations
  public character!: Category | null;
  public GalleryImages!: Asset[] | null;
  public PreviewImage!: Asset | null;
  public Inventory!: InventoryItem | null;
  public Category!: Category[] | null;
  public group_has_product!: GroupProduct | null;
  public groups?: Group[] | null;
  public group?: Group | null;
  public promo_id!: number | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());

    if (values.PreviewImage)
      values.preview = values.PreviewImage;
    delete values.PreviewImage;

    if (values.GalleryImages)
      values.images = values.GalleryImages;
    delete values.GalleryImages;

    if (values.group_has_product) values.group = values.group_has_product.group;
    delete values.group_has_product;

    return values;
  }
};

const hooks = {
  beforeValidate: ((model: Product) => {
    model_utils.reference(model, { prefix: "pdct" });
  }),
  beforeBulkDestroy: async (options: any) =>{
    options.individualHooks = true;
    return options;
  },
};

Product.init({
  reference: model_specs.reference(),

  handle: model_specs.generic_string(),
  name: model_specs.generic_string(),
  alt_name: model_specs.generic_string(),
  sku: model_specs.generic_string(),
  upc: model_specs.generic_string(),
  material: model_specs.generic_string(),

  stock: model_specs.number(),

  status: model_specs.generic_string(),

  price: model_specs.decimal(),
  promo_price: model_specs.decimal(),

  features: model_specs.generic_string(),
  materials: model_specs.generic_string(),
  certificates: model_specs.generic_string(),
  
  category_id: model_specs.foreign_key(),
  character_id: model_specs.foreign_key(),
  product_type_id: model_specs.foreign_key(),
  is_new: model_specs.boolean(),
  is_sale: model_specs.boolean(),
  has_gift: model_specs.boolean(),
  has_accessory: model_specs.number(),
  promo_id: model_specs.foreign_key(),
}, {
  ...model_utils.model_defaults(Product.TABLENAME),
  defaultScope: {
    attributes: {
      include: ["updated_at"],
    },
  },
  hooks, sequelize,
});

Product.crud = new CrudSpec();
Product.crud.search = ["name", "alt_name", "sku", "upc"];
Product.crud.create = ["name", "alt_name", "sku", "upc", "material", "status", "stock", "price"];
Product.crud.update = [
  "handle",
  "name",
  "alt_name",
  "sku",
  "upc",
  "material",
  "status",
  "stock",
  "price",
  "promo_price",
  "features",
  "certificates",
  "materials",
  "is_new",
  "is_sale",
  "has_gift",
  "category_id",
  "character_id",
  "product_type_id",
];
Product.crud.validators = {
  create: [
    validator.required(["name", "status", "stock"]),
  ],
  update: [
    validator.required(["name", "status", "stock"]),
    validator.number(["stock", "price"]),
  ],
};
Product.crud.filter.account = (config: QueryConfig) => {
  Product.crud.filter.default(config);
  const { query, options } = config;

  QueryOptions.query_column(config, "status");

  if (query.price) {
    const [low_price, high_price] = query.price.split(",");
    options.filter_price({ low_price, high_price }, "price");
  }
};
Product.crud.filter.admin = (config: QueryConfig) => {
  Product.crud.filter.account(config);
};

export default Product;
