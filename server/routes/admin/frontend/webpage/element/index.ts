import { cruder, load_model, parse_query } from "@kidztime/middlewares";
import { Router } from "express";
import { WebpageItem } from "@kidztime/models";
import { SvMedia } from "@kidztime/services";

const router = Router();

router.get("/list", cruder.list(WebpageItem));
router.get("/:webpage_item_id/detail",parse_query(),require("./detail").default);
router.post("/:webpage_item_id/update", load_model(WebpageItem), require("./asset_update").default, cruder.update(WebpageItem));
router.delete("/:webpage_item_id/delete", cruder.destroy(WebpageItem));

router.post("/:webpage_item_id/image", load_model(WebpageItem), SvMedia.s3_mw_assoc(WebpageItem, WebpageItem.AssetAssoc.Main, { overwrite: true }));

export default router;
