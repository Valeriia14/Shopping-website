import { Order } from "../billing";
import { Account, AccountPrivilege, Credential, Privilege, PasswordRequest, ServiceProfile } from "../identity";
import { ObjectMeta, VerifyRequest } from "../misc";
import { Session } from "../session";

//shipping_default
//payment_method_default

Privilege.belongsToMany(Account, {
  through: AccountPrivilege,
  foreignKey: "privilege_id",
  otherKey: "account_id"
});
Privilege.addScope("roles", {
  where: { type: Privilege.Types.role }
});

Account.belongsToMany(Privilege, {
  as: "roles",
  through: AccountPrivilege,
  foreignKey: "account_id",
  otherKey: "privilege_id",
  scope: {
    type: Privilege.Types.role
  },
});
Account.belongsToMany(Privilege, {
  as: "privileges",
  through: AccountPrivilege,
  foreignKey: "account_id",
  otherKey: "privilege_id",
});
Account.hasOne(Credential, {
  foreignKey: "account_id",
});
Account.hasOne(VerifyRequest, {
  foreignKey: "account_id",
});
Account.hasOne(Order, {
  as: "order",
  foreignKey: "account_id",
  scope: {
    status: Order.STATUS.open,
  },
});
Account.hasMany(Order, {
  as: "orders",
  foreignKey: "account_id",
});
Account.hasMany(ServiceProfile, {
  foreignKey: "account_id",
});
Account.hasMany(ServiceProfile, {
  as: "stripes",
  foreignKey: "account_id",
  scope: {
    service: ServiceProfile.SERVICE.stripe,
  },
});
Account.hasMany(Session, {
  as : "session",
  foreignKey: "account_id"
});

Account.addScope("account", {
  include: [{
    model: Privilege,
    as: "privileges",
    attributes: ["name", "domain"],
  }, {
    model: Order,
    as: "order",
  }, {
    model: ServiceProfile,
    as: "stripes",
  }, {
    model : Session,
    as : "session"
  }],
});
Account.addScope("admin", {
  include: [{
    model: Privilege,
    as: "privileges",
    attributes: ["name", "domain"],
  }],
});

Credential.belongsTo(Account, {
  foreignKey: "account_id",
});
Credential.hasMany(PasswordRequest, {
  foreignKey: "credential_id",
});

VerifyRequest.belongsTo(Account, {
  foreignKey: "account_id",
});

ServiceProfile.belongsTo(Account, {
  foreignKey: "account_id",
});
ServiceProfile.hasOne(ObjectMeta, {
  foreignKey: "owner_id",
  scope: {
    owner_type: ServiceProfile.name,
  },
});

export default {};
