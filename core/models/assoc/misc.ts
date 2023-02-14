import { Asset, EventLog, ObjectMeta, VerifyRequest } from "../misc";
import { Account, ServiceProfile } from "../identity";
import { CoreDesign, QuestionAnswer, Review } from "../ugc";
import { Category } from "../classification";
import { Product } from "../product";

//payment_method_default
ObjectMeta.hasOne(Account, {
  foreignKey: "payment_method_default_id",
});

VerifyRequest.belongsTo(Account, {
  foreignKey: "account_id",
});

EventLog.belongsTo(Account, {
  foreignKey: "actor_id",
  as: "actor",
});
EventLog.addScope("admin", {
  include: [{
    model: Account,
    as: "actor",
  }]
});

ObjectMeta.belongsTo(ServiceProfile, {
  foreignKey: "owner_id",
});
ObjectMeta.hasMany(Asset, {
  as: "page-images",
  foreignKey: "owner_id",
  scope: {
    assoc_type: ObjectMeta.KEY.page_image,
    owner_type: ObjectMeta.TABLENAME,
  },
});

Account.hasMany(QuestionAnswer, {
  foreignKey: "account_id",
});

Account.hasMany(Review, {
  foreignKey: "account_id",
});

Review.belongsTo(Account, {
  foreignKey: "account_id",
});

QuestionAnswer.belongsTo(Account, {
  foreignKey: "account_id"
});
QuestionAnswer.belongsTo(CoreDesign, {
  foreignKey: "design_id"
})

Review.belongsTo(Product, {
  foreignKey: "product_id"
})

QuestionAnswer.belongsTo(Product, {
  foreignKey: "product_id"
})

Review.hasMany(Asset, {
  foreignKey: "owner_id",
  as: "assets",
  scope: {
    owner_type: Review.TABLENAME,
  },
});
export default {};
