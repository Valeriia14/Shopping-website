require("@kidztime/utilities");
require("@kidztime/config").default.__configure(`./config`);
require("@kidztime/models");

import { Asset, Category, Inventory, InventoryItem, Product, ProductInfo, transact } from "@kidztime/models";
import { GenericOpts } from "@kidztime/services/types";
import { SvHandle } from "@kidztime/services";
import fetch from "node-fetch";

const ENDPOINT = `https://www.kidztime.com/api/data/product/list?offset=0&limit=500`;

(async () => {
  const request = await fetch(ENDPOINT);
  const response = await request.json();
  const models: ProductData[] = response?.data?.models ?? []

  await transact().run(async (transaction) => {

    const inventory = await Inventory.findOne({ where: { name: "kidztime" }, transaction });
    if (!inventory)
      throw new Error("inventories not initialised, please run seed first");

    for (const model of models) {
      console.log("import product", model.name)

      const product = await import_product(model, inventory, { transaction });

      const request = await fetch(`https://www.kidztime.com/api/data/product/${model.id}/images`);
      const response = await request.json();

      const images: ImageData[] = response?.data?.model?.images ?? [];
      for (const image of images) {
        await Asset.create({
          owner_type: Product.TABLENAME,
          owner_id: product.id,
          assoc_type: Product.AssetGalleryImages,
          uri: image.url,
        }, { transaction });
      }

      if (model.categoryType) {
        const product_type = await import_type(model.categoryType, { transaction });
        await product_type.addProduct(product, { transaction });
      }

      if (model.categoryCode) {
        const category = await import_category(model.categoryCode, { transaction });
        await category.addProduct(product, { transaction });
      }

      if (model.character) {
        const character = await import_character(model.character, { transaction });
        await character.addProduct(product, { transaction });
      }
    }
  });


})().catch(console.error).finally(() => process.exit(0));

interface ImageData {
  filename: string;
  altText: string;
  prefix: string;
  host: string;
  viewableType: string;
  filesize: number;
  id: number;
  type: string;
  contentType: string;
  url: string;
  pathname: string;
  viewableId: number;
}

interface ProductData {
  preview: string;
  b2bStock: number;
  description: string;
  inBundle: boolean;
  reference: string;
  hideXML: boolean;
  discPct: string;
  sellingPrice: number;
  character?: CharacterData;
  eta: string;
  avgRating: number;
  altName: string;
  id: number;
  sku: string;
  stock: number;
  basePrice: number;
  height: number;
  discounted: boolean;
  image: string;
  b2bStatus: string;
  showBundle: boolean;
  upc: string;
  weight: 0;
  handle: string;
  categoryCode?: CategoryData;
  cleanName: string;
  categoryType?: ProductTypeData;
  depth: number;
  material: string;
  validBundle: boolean;
  revCount: number;
  width: number;
  name: string;
  categoryTypeId: number;
}

const import_product = async (product_data: ProductData, inventory: Inventory, opts: GenericOpts = {}): Promise<Product> => {
  const { transaction } = opts;

  const product = await Product.create({
    handle: product_data.handle,
    name: product_data.name,
    alt_name: product_data.altName,
    sku: product_data.sku,
    upc: product_data.upc,
    material: product_data.material,
    stock: product_data.stock,
    status: Product.Status.Published,
    price: product_data.basePrice,
  }, { transaction });

  const product_info = await ProductInfo.create({
    product_id: product.id,
    description: product_data.description,
  }, { transaction });

  await InventoryItem.create({
    inventory_id: inventory.id,
    product_id: product.id,
    count: 5,
  }, { transaction });

  await Asset.create({
    owner_type: Product.TABLENAME,
    owner_id: product.id,
    assoc_type: Product.AssetPreviewImage,
    uri: product_data.preview,
  }, { transaction });

  product.product_info = product_info;

  return product;
}

interface ProductTypeData {
  name: string;
  id: number;
}

const type_map: {
  [id: number]: Category
} = {};
const import_type = async (type_data: ProductTypeData, opts: GenericOpts = {}): Promise<Category> => {
  const { transaction } = opts;

  const importedCategory = type_map[type_data.id];
  if (importedCategory) return importedCategory;

  const handle = await SvHandle.generate_unique_handle(type_data.name, Category, { transaction })
  const newCategory = await Category.create({
    type: "product_type",
    name: type_data.name,
    handle,
  }, { transaction });

  type_map[type_data.id] = newCategory;

  return newCategory;
}

interface CategoryData {
  code: string;
  depth: number;
  material: string;
  maxAge: number;
  minAge: number;
  width: number;
  name: string;
  weight: number;
  description: string;
  id: number;
  height: number;
}

const category_map: {
  [id: number]: Category
} = {};
const import_category = async (category_data: CategoryData, opts: GenericOpts = {}): Promise<Category> => {
  const { transaction } = opts;

  const importedCategory = category_map[category_data.id];
  if (importedCategory) return importedCategory;

  const handle = await SvHandle.generate_unique_handle(category_data.name, Category, { transaction })
  const newCategory = await Category.create({
    type: "category",
    name: category_data.name,
    handle,
    description: category_data.description,
    extras: JSON.stringify({
      code: category_data.code,
    }),
  }, { transaction });

  category_map[category_data.id] = newCategory;

  return newCategory;
}

interface CharacterData {
  image: string;
  code: string;
  name: string;
  id: number;
  type: string;
}

const character_map: {
  [id: number]: Category
} = {};
const import_character = async (character_data: CharacterData, opts: GenericOpts = {}): Promise<Category> => {
  const { transaction } = opts;

  const importedCategory = character_map[character_data.id];
  if (importedCategory) return importedCategory;

  const handle = await SvHandle.generate_unique_handle(character_data.name, Category, { transaction });
  const newCategory = await Category.create({
    type: "character",
    name: character_data.name,
    handle,
    description: `[${character_data.code}] ${character_data.name}`,
    extras: JSON.stringify({
      code: character_data.code,
    }),
  }, { transaction });

  character_map[character_data.id] = newCategory;

  await Asset.create({
    owner_type: Category.TABLENAME,
    owner_id: newCategory.id,
    uri: character_data.image,
  }, { transaction });

  return newCategory;
}
