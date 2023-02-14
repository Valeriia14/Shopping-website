import { cruder, load_child_model, load_model, parse_query } from "@kidztime/middlewares";
import { Asset, ObjectMeta } from "@kidztime/models";
import { SvMedia } from "@kidztime/services";
import { Router } from "express";

const router = Router();

router.get("/list", parse_query(), require("./list").default);
router.get("/:handle/detail", require("./detail").default);
router.post("/create", require("./create").default);
router.post("/update", require("./update").default);
router.post("/bulk", require("./bulk_update").default);

router.post("/:objectmeta_id/images/create", load_model(ObjectMeta), SvMedia.s3_mw_assoc(ObjectMeta, ObjectMeta.KEY.page_image));
router.delete("/:objectmeta_id/images/:asset_id/delete", load_model(ObjectMeta), load_child_model(Asset, ObjectMeta, { foreign_key: "owner_id" }), cruder.destroy(Asset));

export default router;
