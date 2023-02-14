import { make_page_middleware } from "@kidztime/middlewares";
import { Asset, ObjectMeta } from "@kidztime/models";
import { GenericOpts } from "../types";

export const retrieve_settings = async (opts?: GenericOpts) => {
  ObjectMeta.hasOne(Asset, {
    foreignKey: "owner_id",
    scope: {
      owner_type: ObjectMeta.name,
    },
  });

  const settings_page = await ObjectMeta.findAll({
    where: {
      key: ObjectMeta.KEY.settings,
    },
    include: [Asset],
    limit: 9999,
    transaction: opts?.transaction,
  });

  return settings_page;
};

export const set_objectmeta_middleware = () => {
  return make_page_middleware(async (_, res) => {
    const settings = await retrieve_settings();
    res.page_data.settings = settings;
  });
};
