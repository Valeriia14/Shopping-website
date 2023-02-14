require("@kidztime/utilities");
require("@kidztime/config").default.__configure(`./config`);
require("@kidztime/models");

import { Account, Category, CategoryProduct, Credential, Inventory, InventoryItem, ObjectMeta, Product, transact } from "@kidztime/models";
import { SvAuthenticate, SvClassification, SvIdentitiy, SvProduct } from "@kidztime/services";
import { GenericOpts } from "@kidztime/services/types";
import { chirp } from "@kidztime/utilities";
import bcrypt from "bcrypt";
import fs from "fs";
import toml from "toml";

const seed_accounts = async ({ transaction }: GenericOpts) => {
  const config = toml.parse(fs.readFileSync(`${__dirname}/accounts.toml`, "utf8"));
  chirp("seed accounts", config.accounts.length);

  for (const data of config.accounts) {
    const { email_address } = data;
    const existing = await Account.findOne({ where: { email_address }, transaction });

    chirp("seed account", email_address, "exists:", existing?.id ?? "no");
    if (!existing)
      await create_seed_account(data, { transaction });
  }
};

type SeedAccountProps = {
  firstname: string;
  lastname: string;
  email_address: string;
  password: string;
  privileges: string[];
};
const create_seed_account = async (props: SeedAccountProps, opts: GenericOpts) => {
  const { firstname, lastname, email_address, privileges } = props;
  let { password } = props;
  await transact(opts.transaction).run<Account>(async (transaction) => {
    const account = await SvIdentitiy.create_account({
      firstname, lastname, email_address,
      actor_id: null,
    }, { transaction });

    if (privileges.length > 0) {
      await SvAuthenticate.add_privilege({
        privileges,
        recipient: account,
        actor_id: account.id,
      }, { transaction });
    }

    password = bcrypt.hashSync(password, 10);
    await SvIdentitiy.create_credential({
      account: account,
      access_handle: email_address,
      secret: password,
      type: Credential.Types.password,
      actor_id: account.id,
    }, { transaction });
    return account;
  });
};

const seed_inventories = async ({ transaction }: GenericOpts) => {
  const config = toml.parse(fs.readFileSync(`${__dirname}/inventories.toml`, "utf8"));
  chirp("seed inventory", config.inventories.length);

  for (const data of config.inventories) {
    const { name } = data;
    const existing = await Inventory.findOne({ where: { name }, transaction });

    chirp("seed inventory", name, "exists:", existing?.id ?? "no");
    if (!existing)
      await Inventory.create(data, { transaction });
  }
};

const seed_categories = async ({ transaction }: GenericOpts) => {
  const config = toml.parse(fs.readFileSync(`${__dirname}/categories.toml`, "utf8"));
  chirp("seed category", config.categories.length);

  for (const data of config.categories) {
    const { type, name } = data;
    const existing = await Category.findOne({ where: { type, name }, transaction });

    chirp("seed category", `${type}-${name}`, "exists:", existing?.id ?? "no");
    if (!existing)
      await SvClassification.create_category(data, { transaction });
  }
};

const seed_banner = async ({ transaction }: GenericOpts) => {
  const config = toml.parse(fs.readFileSync(`${__dirname}/banners.toml`, "utf8"));
  chirp("seed banner", config.banners.length);
  const key = ObjectMeta.KEY.banner;

  for (const data of config.banners) {
    const { value, order, category_list } = data;
    const existing = await ObjectMeta.findOne({ where: { value, key }, transaction });

    chirp("seed banner", `${key}-${value}`, "exists:", existing?.id ?? "no");
    if (!existing) {
      const category_ids = [];
      for (const category_name of category_list) {
        const category = await Category.findOne({
          where: {
            type: Category.TYPE.category,
            name: category_name,
          },
          transaction,
        });

        if (!category)
          throw new Error(`category not found: ${category_name}`);

        category_ids.push(category.id);
      }

      await ObjectMeta.create({
        key,
        value,
        extra0: order,
        extra1: JSON.stringify(category_ids),
      }, { transaction });
    }
  }
};

const seed_products = async ({ transaction }: GenericOpts) => {
  const config = toml.parse(fs.readFileSync(`${__dirname}/products.toml`, "utf8"));
  chirp("seed products", config.products.length);

  for (const data of config.products) {
    const { product_data, inventories, categories } = data;
    const { sku } = product_data;
    let existing = await Product.findOne({ where: { sku }, transaction });

    chirp("seed product", sku, "exists:", existing?.id ?? "no");
    if (!existing) {
      existing = await SvProduct.create_product({
        ...product_data,
        actor_id: null,
      }, { transaction });
    }

    for (const inventory_data of inventories) {
      const { name, count } = inventory_data;
      const inventory = await Inventory.findOne({ where: { name }, transaction });

      if (!inventory)
        throw new Error(`inventory not found: ${name}`);

      const inventory_item = await InventoryItem.findOne({
        where: {
          product_id: existing.id,
          inventory_id: inventory.id,
        },
        transaction,
      });

      chirp("seed product inventory", name, "exists:", inventory?.id ?? "no");
      if (!inventory_item) {
        await InventoryItem.create({
          product_id: existing.id,
          inventory_id: inventory.id,
          count,
        }, { transaction });
      }
    }

    for (const category_data of categories) {
      const { type, name } = category_data;
      const category = await Category.findOne({ where: { type, name }, transaction });

      if (!category)
        throw new Error(`category not found: ${type} ${name}`);

      const category_product = await CategoryProduct.findOne({
        where: {
          product_id: existing.id,
          category_id: category.id,
        },
        transaction,
      });

      chirp("seed product category", `${type}-${name}`, "exists:", category_product?.category_id ?? "no");
      if (!category_product) {
        await CategoryProduct.create({
          product_id: existing.id,
          category_id: category.id,
        }, { transaction });
      }
    }
  }
};

(async () => {
  await transact().run(async (transaction) => {
    await SvAuthenticate.sync_privileges({ transaction });

    await seed_accounts({ transaction });
    await seed_inventories({ transaction });
    await seed_categories({ transaction });
    await seed_banner({ transaction });
    await seed_products({ transaction });
  });
})()
  .then(() => chirp("seed complete"))
  .catch(console.error)
  .finally(() => process.exit(0));
