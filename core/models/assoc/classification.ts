import {
  Category,
  CategoryLink,
  CategoryProduct,
  Group,
  GroupProduct,
  ProductGroup,
  CategoryProductType,
  ProductType,
  Character
} from "../classification";
import { Asset } from "../misc";
import { Product } from "../product";
import { Webpage, WebpageItem } from '../frontend'
import { QuestionAnswer, Review } from "../ugc";

Category.hasMany(CategoryProduct, {
  foreignKey: "category_id",
});

//CategoryProductType

// Category.hasMany(CategoryProductType, {
//   foreignKey: "category_id",
// });
// ProductType.hasMany(CategoryProductType, {
//   foreignKey: "product_type_id",
// });

// CategoryProductType.belongsTo(ProductType, {
//   foreignKey: "product_type_id",
//   as: "child",
// });

// Category.belongsToMany(ProductType, {
//   through: CategoryProductType,
//   foreignKey: "category_id",
//   otherKey: "product_type_id",
// });
Category.hasMany(ProductType, {
  foreignKey: "category_id",
})

ProductType.belongsTo(Category, {
  foreignKey: "category_id",
});
// Category.belongsToMany(Product, {
//   through: Product,
//   foreignKey: "category_id",
//   otherKey: "id",
// });

Category.hasMany(Product, {
  foreignKey: "category_id",
});

Character.hasMany(Product, {
  foreignKey: "character_id",
});

ProductType.hasMany(Product, {
  foreignKey: "product_type_id",
});

Character.hasMany(Asset, {
  foreignKey: "owner_id",
  scope: {
    owner_type: Character.TABLENAME,
  },
  // as: 'assets'
});
ProductType.hasMany(Asset, {
  foreignKey: "owner_id",
  scope: {
    owner_type: ProductType.TABLENAME,
  },
  as: 'assets'
});
ProductType.hasMany(Review, {
  foreignKey: "product_type_id",
  as: 'reviews'
});
ProductType.hasMany(QuestionAnswer, {
  foreignKey: "product_type_id",
  as: 'question_answers'
});
//character 
Character.belongsTo(Webpage, {
  foreignKey: "webpage_id",
  as: "webpage"
});

Character.addScope("public", {
  include: [{
    model: Asset,
    as: 'assets'
  },
  {
    model: Webpage,
    as: 'webpage',
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
});
//Product Type

ProductType.belongsTo(Webpage, {
  foreignKey: "webpage_id",
  as: "webpage"
});

ProductType.addScope("public", {
  include: [{
    model: Asset,
    as: 'assets'
  },
  {
    model: Webpage,
    as: 'webpage',
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
});

//

Category.belongsToMany(Product, {
  through: CategoryProduct,
  foreignKey: "category_id",
  otherKey: "product_id",
});
Category.hasMany(Asset, {
  foreignKey: "owner_id",
  scope: {
    owner_type: Category.TABLENAME,
  },
  // as: 'assets'
});

Category.belongsTo(Webpage, {
  foreignKey: "webpage_id",
  as: "webpage"
});
Category.hasMany(CategoryLink, {
  foreignKey: "parent_id",
  as: "parent",
});
Category.hasOne(CategoryLink, {
  foreignKey: "child_id",
  as: "child",
});
Category.addScope("public", {
  include: [{
    model: Asset,
    as: 'assets'
  },
  {
    model: Webpage,
    as: 'webpage',
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
});
Category.addScope("account", {
  include: [{
    model: Asset,
    as: 'assets'
  }],
});
Category.addScope("admin", {
  include: [{
    model: Asset,
    as: 'assets'
  }, {
    model: CategoryLink,
    as: "child",
    include: [{
      model: Category,
      as: "parent",
    }],
  }],
});

CategoryLink.belongsTo(Category, {
  foreignKey: "parent_id",
  as: "parent",
});
CategoryLink.belongsTo(Category, {
  foreignKey: "child_id",
  as: "child",
});

CategoryProduct.belongsTo(Category, {
  foreignKey: "category_id",
});
CategoryProduct.belongsTo(Product, {
  foreignKey: "product_id",
});

//For group has many products but product belongs to one group
Group.hasMany(GroupProduct, {
  foreignKey: "group_id",
  as: "products_of_group"
})
GroupProduct.belongsTo(Group, { foreignKey: "group_id" })
GroupProduct.belongsTo(Product, { foreignKey: "product_id" })

//For product has many groups and one group belongs to many products
Group.belongsToMany(Product, {
  as: "products",
  through: ProductGroup,
  foreignKey: "group_id",
  otherKey: "product_id"
})

Group.addScope("admin", {
  include: [{
    model: GroupProduct,
    as: "products_of_group",
    include: [Product]
  }]
});

Group.addScope("admin_detail", {
  include: [{
    model: GroupProduct,
    as: "products_of_group",
    include: [Product]
  }]
});
export default {};
