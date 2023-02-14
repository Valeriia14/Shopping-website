import { controller, Request, Response } from "@kidztime/middlewares";
import { ObjectMeta, Asset } from "@kidztime/models";

export default controller(async (req: Request, res: Response) => {
  ObjectMeta.hasOne(Asset, {
    foreignKey: "owner_id",
    scope: {
      owner_type: ObjectMeta.name,
    },
  });

  const allSettings = await ObjectMeta.findAll({
    where: {
      key: ObjectMeta.KEY.settings,
    },
    limit: 9999,
    include: [Asset],
  });

  res.result.models = allSettings;
});
