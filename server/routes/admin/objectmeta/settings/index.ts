import { ObjectMeta } from "@kidztime/models";
import { load_model, cruder, load_child_model } from "@kidztime/middlewares";
import { SvMedia } from "@kidztime/services";
import { Asset } from "@kidztime/models";

import { Router } from "express";

const router = Router();

router.get("/list", require("./list").default);

router.post("/create", require("./create").default);

router.post(
  "/:objectmeta_id/images/upload",
  load_model(ObjectMeta),
  SvMedia.s3_mw_assoc(ObjectMeta, ObjectMeta.AssetPreviewImage, {
    overwrite: true,
  })
);

router.delete(
  "/:objectmeta_id/images/:asset_id/delete",
  load_model(ObjectMeta),
  load_child_model(Asset, ObjectMeta, { foreign_key: "owner_id" }),
  cruder.destroy(Asset)
);

export default router;
