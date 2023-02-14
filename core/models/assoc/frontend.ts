import { Webpage, WebpageItem } from "../frontend";
import { Asset } from "../misc";

Webpage.hasMany(WebpageItem, {
  foreignKey: "webpage_id",
});

WebpageItem.belongsTo(Webpage, {
  foreignKey: "webpage_id",
});
WebpageItem.hasMany(Asset, {
  foreignKey: "owner_id",
  as: "assets",
  scope: {
    owner_type: WebpageItem.TABLENAME,
  },
});

export default {};
