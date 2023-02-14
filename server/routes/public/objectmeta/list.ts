import { controller, Request, Response } from "@kidztime/middlewares";
import { ObjectMeta, Asset } from "@kidztime/models";

export default controller(async (_: Request, res: Response) => {
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
  });

  res.result.models = settings_page;
});
