import { OrderItem } from "../billing";
import { InventoryItem } from "../inventory";
import {
  Category,
  CategoryProduct,
  Character,
  Group,
  GroupProduct,
  ProductGroup,
  ProductType
} from "../classification";
import { Asset } from "../misc";
import { Product, ProductInfo } from "../product";
import { QuestionAnswer, Review } from "../ugc";
import { CartItem } from "..";

Product.hasMany(OrderItem, {
  foreignKey: "product_id",
});
// Product.hasMany(CartItem, {
//   foreignKey: "product_id",
// });
Product.hasMany(QuestionAnswer, {
  foreignKey: "product_id",
});
Product.hasMany(Review, {
  foreignKey: "product_type_id",
  sourceKey: "product_type_id",
});

Product.hasOne(Asset, {
  as: "PreviewImage",
  foreignKey: "owner_id",
  scope: {
    assoc_type: Product.AssetPreviewImage,
    owner_type: Product.TABLENAME,
  },
});
Product.hasMany(Asset, {
  as: "GalleryImages",
  foreignKey: "owner_id",
  scope: {
    assoc_type: Product.AssetGalleryImages,
    owner_type: Product.TABLENAME,
  },
});
Product.hasMany(InventoryItem, {
  foreignKey: "product_id"
});
Product.hasMany(CategoryProduct, {
  foreignKey: "product_id",
});
// Product.belongsToMany(Category, {
//   through: CategoryProduct,
//   foreignKey: "product_id",
//   otherKey: "category_id",
// });
// Product.belongsToMany(Category, {
//   through: CategoryProduct,
//   as: "Category",
//   foreignKey: "product_id",
//   otherKey: "category_id",
//   // scope: { type: Category.TYPE.category },
// });


// Product has one in new version
Product.belongsTo(Category, {
  foreignKey: "category_id",
});
Product.belongsTo(Character, {
  foreignKey: "character_id",
});
Product.belongsTo(ProductType, {
  foreignKey: "product_type_id",
});


Product.hasOne(GroupProduct, { foreignKey: "product_id" })

// Product.belongsToMany(Group, {
//   as: "groups",
//   through: ProductGroup,
//   foreignKey: "product_id",
//   otherKey: "group_id"
// })
Product.hasMany(Group, {
  as: "groups",
  foreignKey: "id",
  sourceKey: "promo_id",
})

Product.addScope("public_listing", {
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
});

Product.addScope("public", {
  include: [Category, {
    model: Asset,
    as: "PreviewImage",
  }, {
      model: Group,
      as: "groups",
      include: [{
        model: GroupProduct,
        as: "products_of_group",
        include: [Product]
      }]
    }, {
      model: GroupProduct,
      include: [Group]
    }],
});
Product.addScope("public_detail", {
  include: [Category, {
    model: Asset,
    as: "PreviewImage",
  }, {
      model: Asset,
      as: "GalleryImages",
    }, {
      model: Group,
      as: "groups",
      include: [{
        model: GroupProduct,
        as: "products_of_group",
        include: [Product]
      }]
    }, {
      model: GroupProduct,
      include: [Group]
    }],
});
Product.addScope("account", {
  include: [Category, {
    model: Asset,
    as: "PreviewImage",
  }],
});
Product.addScope("account_detail", {
  include: [Category, {
    model: Asset,
    as: "PreviewImage",
  }, {
      model: Asset,
      as: "GalleryImages",
    }],
});
Product.addScope("admin", {
  include: [
    Category,
    {
      model: Asset,
      as: "PreviewImage",
    },
    {
      model: Group,
      as: "groups",
      include: [
        {
          model: GroupProduct,
          as: "products_of_group",
          include: [Product],
        },
      ],
    },
    {
      model: GroupProduct,
      include: [Group],
    },
  ],
});
Product.addScope("admin_detail", {
  include: [
    { model: Category },
    { model: Character },
    { model: ProductType },
    {
      model: Asset,
      as: "PreviewImage",
    },
    {
      model: Asset,
      as: "GalleryImages",
    },
    {
      model: InventoryItem,
    },
    {
      model: Group,
      as: "groups",
      include: [
        {
          model: GroupProduct,
          as: "products_of_group",
          include: [Product],
        },
      ],
    },
    {
      model: GroupProduct,
      include: [Group],
    },
  ],
});


Asset.belongsTo(Product, {
  foreignKey: "owner_id",
  scope: {
    "$asset.owner_type$": Product.TABLENAME,
    "$asset.assoc_type$": Product.AssetPreviewImage,
  },
});
Asset.belongsTo(Product, {
  foreignKey: "owner_id",
  scope: {
    "$asset.owner_type$": Product.TABLENAME,
    "$asset.assoc_type$": Product.AssetGalleryImages,
  },
});
Asset.belongsTo(Category, {
  foreignKey: "owner_id",
  scope: { "$asset.owner_type$": Category.TABLENAME },
});
Asset.belongsTo(ProductType, {
  foreignKey: "owner_id",
  scope: { "$asset.owner_type$": ProductType.TABLENAME },
});

export default {};
